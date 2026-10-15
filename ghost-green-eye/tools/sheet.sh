#!/bin/bash
# usage: tools/sheet.sh outdir t1 t2 ...  -> renders stills and writes outdir/sheet.png (2 columns)
out=$1; shift; rm -rf "$out"; node "$(dirname "$0")/still.mjs" "$out" "$@" | grep -v "^/" ; python3 - "$out" <<'PY'
import sys,glob
from PIL import Image
d=sys.argv[1]; fs=sorted(glob.glob(d+'/f_*.png')); ims=[Image.open(f).resize((800,450)) for f in fs]
rows=(len(ims)+1)//2; sheet=Image.new('RGB',(1600,450*rows),'white')
for i,im in enumerate(ims): sheet.paste(im,((i%2)*800,(i//2)*450))
sheet.save(d+'/sheet.png')
PY
