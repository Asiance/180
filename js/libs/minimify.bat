@echo off

set jsoutput=jquery.10.min.js

echo /** > %jsoutput%
echo * 180° minimified >> %jsoutput%
echo *  >> %jsoutput%
echo * This is a part of the 180° Framework >> %jsoutput%
echo *  >> %jsoutput%
echo * @author Karine Do, Laurent Le Graverend >> %jsoutput%
echo * @date %DATE% >> %jsoutput%
echo * @see https://github.com/Asiance/180/ >> %jsoutput%
echo * @version 2 >> %jsoutput%
echo */ >> %jsoutput%

for %x in (*180*.js) do jsmin <"%x" >>"hjh"