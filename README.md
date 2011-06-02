R2 - a CSS LTR ∞ RTL converter for i18 friendly layouts
---

              ...Z$ZO8=..
             I=,7M8M87,=,. .
          .~=~..78OOII+.:~.
        ..,.=:.=MIII$87..:..
        .::.8+:.7=77Z7+8O7=~
        .~~:8ZI,O+O$+$.88I$:.. .
        ..??Z8O88888OZO88$=~+. .
        ...?Z$I=,,::::~?77:.+. .
        ...:.$?~,.....,~.,:.,...
    .   ..:~.IOO8OZZOOOZ,:?:~+.
    .....=::....,::::::::,::.:......
    ,,,,~I=~,888OOO8DO88=,::=+:::...
    ++=~87?==~===+==+=++=::~88???...
    7$77I7==,:~~:+..D:~:.~,=$87$7,
    ..N77,..=+~:=N$Z8=:,,~..,77M.
    ..MII:ZO,~=?+===+=+=:=.,:77M:.
    .,?77,Z8==I$7MIZM+=++=?N,$$+~
     .7ZI.Z8+.7Z7OOZZI??+=:M,I7O.
     .IIZ,,:?:IO7DDDD7???+~?.$I?.
    ..ZII7~~,I+?7ZZZ$$77=~~+I$II=
     .:~==~8=.I?7$OO7$7I,:7$+=?=:
    ..::~~~I7. ...$Z7.  .+7$~:=~~.
    .:::Z?$7Z....ZO8D.   ~$+=+I=~.
    .:~:8+=+.....:I$?~....ZZZ7$:~:
      ....  .  ..,?$?:..    ....  .
               ,.7$7$+=.    ....
              .:7I8D7$$.
               ,77O877=.
-----------

Install it
----------

    $ [sudo] npm install r2 -g

Use it as a CLI

    $ r2 input.css output.css

Or require it as a Node module

``` js
var output = require('r2').swap(css)
```

Usage notes
--------
R2 helps you achieve friendly layouts cross-language multiple languages (including bi-directional text). It looks like this:

``` css
/* before */
body {
  float: left;
  margin-right: 2px;
  padding: 1px 2px 3px 4px;
  left: 5px;
}
div {
  text-align: right;
}

/* after */
body {
  float: right;
  margin-left: 2px;
  padding: 1px 4px 3px 2px;
  right: 5px;
}
div {
  text-align: left;
}
```

Caution
--------
R2 will only work as good as what you give it, therefore *inline-styles* embedded in your HTML will not converted, and therefore may cause unexpected results. However inline-styles apart from R2 is still a bad idea, and you should avoid it anyway in favor of separating content from presentation.