#!/usr/bin/env bash
# Captain Video: bring Majed's updates into this fork without losing our work.
#   bash tools/majed-update.sh check              what Majed released since our base, and what changed
#   bash tools/majed-update.sh merge <tag>        merge one Majed release (e.g. v6.1.0) on top of our work
#   bash tools/majed-update.sh undo               cancel the last Majed merge (keeps history, our work stays)
#   bash tools/majed-update.sh restore <path> [<ref>]   bring back a file or folder from before the last merge
#   bash tools/majed-update.sh history            Majed merges and their safety points
# Details: video-ad-editor/references/fork-updates.md
set -euo pipefail
cd "$(dirname "$0")/.."
MAJED_URL="https://github.com/majedphotos/video-ad-editor.git"
git remote get-url majed >/dev/null 2>&1 || git remote add majed "$MAJED_URL"
base(){ cat video-ad-editor/VERSION 2>/dev/null || echo 0; }
clean(){ [ -z "$(git status --porcelain --untracked-files=no)" ] || { echo "⛔ فيه تعديلات مش متسجلة — اعمل commit الأول."; exit 3; }; }

case "${1:-check}" in
  check)
    git fetch -q majed --tags
    B="v$(base)"; L="$(git tag -l 'v*' --sort=-v:refname | head -1)"
    echo "نسختك مبنية على: $B · آخر إصدار عند ماجد: $L"
    if [ "$B" = "$L" ]; then echo "✓ مفيش جديد."; exit 0; fi
    echo "— اللي اتغيّر عند ماجد من $B لـ$L:"
    git log --oneline --no-merges "$B..$L" | sed 's/^/  /'
    echo "— ملفات اتشالت عنده (راجعها قبل الدمج):"
    git diff --name-only --diff-filter=D "$B" "$L" | sed 's/^/  /' || true
    echo "— ملفات احنا غيّرناها وهو كمان غيّرها (ممكن تتعارض):"
    comm -12 <(git diff --name-only "$B" HEAD | sort) <(git diff --name-only "$B" "$L" | sort) | sed 's/^/  /' || true
    ;;
  merge)
    T="${2:?اكتب رقم الإصدار، مثلاً v6.1.0}"; clean
    git fetch -q majed --tags
    git rev-parse -q --verify "refs/tags/$T" >/dev/null || { echo "⛔ مفيش إصدار $T عند ماجد."; exit 2; }
    SAFE="captain/before-$T"
    git tag -f "$SAFE" HEAD >/dev/null
    echo "📌 نقطة رجوع: $SAFE"
    if git merge --no-ff "$T" -m "Merge Majed $T into Captain Video"; then
      V="$(base)"
      sed -i "s/\"version\": *\"[^\"]*\"/\"version\": \"$V-captain.1\"/" .claude-plugin/plugin.json
      git commit -qam "Captain Video $V-captain.1" || true
      echo "✓ اندمج $T. النسخة دلوقتي $V-captain.1"
    else
      echo "⚠️ فيه تعارض في الملفات دي — لازم تتحل بإيد قبل الـcommit:"
      git diff --name-only --diff-filter=U | sed 's/^/  /'
      echo "للإلغاء: git merge --abort"
      exit 4
    fi
    ;;
  undo)
    clean
    M="$(git log --merges --grep='^Merge Majed ' -1 --format=%H)"
    [ -n "$M" ] || { echo "مفيش دمج من ماجد ألغيه."; exit 0; }
    git revert --no-edit -m 1 "$M"
    echo "✓ اتلغى: $(git log -1 --format=%s "$M") — شغلك فاضل زي ما هو."
    echo "ملاحظة: لو عاوز تدمج نفس الإصدار تاني بعدين، الغي الإلغاء ده الأول (git revert HEAD)."
    ;;
  restore)
    P="${2:?اكتب مسار الملف أو الفولدر}"
    R="${3:-$(git tag -l 'captain/before-*' --sort=-creatordate | head -1)}"
    [ -n "$R" ] || { echo "⛔ مفيش نقطة رجوع."; exit 2; }
    git checkout "$R" -- "$P"
    echo "✓ رجع $P زي ما كان عند $R. راجعه واعمل commit."
    ;;
  history)
    git log --merges --grep='^Merge Majed ' --format='%h  %ad  %s' --date=short
    git tag -l 'captain/before-*' --sort=-creatordate
    ;;
  *) sed -n 2,9p "$0"; exit 1 ;;
esac
