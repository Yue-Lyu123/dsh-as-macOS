window.__ModuleLoader__.load({
  id: 'dsh-as-macos',
  factory(require) {
    'use strict';
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useRef, useSyncExternalStore } = React;
    let ReactDOM = null;
    try { ReactDOM = require('react-dom'); } catch (e) { ReactDOM = null; }

    const EGO_KIND = 'ego-browser:watch';
    const EGO_TAB_ID = 'dsh-ego-browser:watch';
    const MENUBAR_H = 25;
    const DOCK_H = 74;
    // while the desktop runs, the native shell is parked here (off-screen but still laid out)
    const PARK_TRANSFORM = 'translate(-300vw, 0px)';
    const PARK_SHIFT = 'calc(0px - 200vw)';
    const WALLPAPER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAoHCAkIBgoJCAkMCwoMDxoRDw4ODx8WGBMaJSEnJiQhJCMpLjsyKSw4LCMkM0Y0OD0/QkNCKDFITUhATTtBQj//2wBDAQsMDA8NDx4RER4/KiQqPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz//wgARCAOEA4QDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAEDAgT/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQUEAv/aAAwDAQACEAMQAAAB9w0vAAAAAAAKAAEAAAAFkqwKAAKEAoQCgUQChASgoQqFEAoAQCgJeSCwIAFUIACKIBQBYBQgACiAUDMaHEAAAAAACgABAAAASgLKAAoAQChALUoEoQAEoKEVKSkoAQACgOOubAAAipZQAAiiUACiAUIAKAgFAzGhxAAAAAAAoAQAAAAEoCygAKAEoQACrEUKEAoQEoCygSgBAAKIciwAIFUIAFiWUCUACiUIAAogFCAMxo8QAAAAAKAAEAAAABKBQAoAQChAqwsAoQAEoKEVKBKAEAAoQ564sCgAhZZQAgUACUBSAUIAWUCAUIqDMaPEAAAACgAABAAAASgWKAAoQAChALRAKEABKEqwKkVC0QAChAE5PUACBYlFACKAJQBQICUACiAUIAKMho8QAAAAKAAEAAAABKKSwUASgABKAKspASgBKAEooEAoQAChCXmyCgAhSUAIAUAlAogAJQFIABQgAoyGjxAAAAoAAQAAAAChCwUAKEAAoQAsS0KEABKEoFiwChAAKEAOOubAoIWFogAIUAlAFgAJQBSUgFACFADIaPEAAACgABAAAAASgLBQAoQAChAKssAoQChASgLLAKEAAoQISHqABBShAARQoQALAKEAFAQChAoABkNHiAAABQAgAAAAAJQCgFCAAUIABVlgJQAlCAVZQSKFCAAlAc9c2QUEAUSgAKQEoAFEAoQBRAAKELKABGQ0uIAAAFCAAAAAgAFAWUBQgAFCAAloUICAUIBVlgFACAgFAnNnqABAqhAARQoQAEUASgLKBAKELKSgEAZDS4gAAUAIAAAACAUACgCUAAJQAWpYCUAJQAlAWWAUIACAUQ5HqBAFSygABFEoAFEAoQBRAAKEKAASgZDS4QAUAAIAAAACAUAoACUAFCALCWpQJQAlCAUWJRQgAIBQHN5sCghZVCAAhRQgCpQJQgBZQIBQgCpQIBQMhpcIKAAAEAAAABKAWCgEoAASgABKpAKEAoQC2WRQoQAEoAHMLAoIolACFlAlAAUlCABQIBQAigACAUDIaXEAAEAAAAABAKBZQAEoAASgBKoBAKEBKChFAEoAASgJeagsCBZQAAhQCUAUCAlAWUCAUIWUACAUAIyGnxAABAAAAAAQClgsFAEoASgACyygEoAShAKLAQlKAEoADjrmwKCKJQAgCgCUBSAlAAUAlACKAIABQAjIafEAEAAAAABAKKSygAKEBAKAEooEAoQChKEWUBKAAEoAHMLAFlAlACKAJQBYACUBQCAUIUAAgFACCjEafEEAAAAABAAKAKABKAEAoASigShAASgoQsoJLQBAKAl5sgBQFCAFlgFCAFIACUUCAAUIWUACAUIAKMRp8QQAAAAAEAAoCgEAoAQCgBLRAKEAoQCixKKEBAAKBOeubAFlAlAFglAlAWUCAUIWUCAUAIoAgFACFlAMRp8QQAAAAAEoABQAEoAASgBAsoAKEAoShCgChAQCgCEhYKAoQALAQCgUQChACywAChAFAEAoQAqFBiNLiAAAAACAAUsKAIBQAgFACVZYBQgFCAUIoAlACAUBLykFKASgBFAEoARQBKAKBAKECgAQCgBAFABiNLiAAAACAAUCygAJQAAlACAWiAUICUAJSiUgFCAAUCc9c2AUQCgCwEoACkAoQBQBAKELKBAAKEALKAAYjS4gAAAAgAFApCgCUAIBQAhRQgJQAlACWxQJQAgFAA5hYsoEoARQBKABRKAELKBAASgUAQAChAFACgYjS4QAAAgAFAFAAlAACAUAJVAJQgAJQhYUUCUAIBQEvKQUpAKALAASgKQAEoFAEABKsoAEAoARQABKBiNPhAAACAAVYFgogFACAAUIFUIBQgJQAlWUCUAIABQHHXNiygSgBCgEoAoEBKAKBAKELKABAAKAEUAQCgYjT4QAAgAAFWUACAUAIBQAgWUFACAlACVZQJQAgFAA5lWSkAoAsABKApAASiksoEAoQsoAEAoARYoAEoAGI0+EAAIBQAKAIABQgAFCLFJZZQUIBQgJVlJZYBQgAFAS8kpYEoAQsoEoCxFAChCygQAChCgAEAoQKAABKABiNPhCAAAUBUKAIBQAgFAFiUWUgFCAlACVYKlgFCAUABzYAAABFAEoCkABKApAAKECgAQChABYUASgAAYjS4QAUCxSKJQCAAUAIBQFiCpQAlACUAJVAJZQCAUACQAAAhQCAUWAAUIFAgFCAKAAJQAgsBQAJQAAMRpcIAKAqFAAEAoAQACgVLASgBKAEoQsKsRQoQACgCEAAALAKEAUQChAFSgQChBRKAQCgBFSgASgAAAYjS4QAUAsKAAIBQgAFACFFCAlACAUJalEqAUIABQHPXIAAELKBKAKBASgLApAKAEUAAQChACgEAoAAAGI0uEFAKAAAgAFCAAUBZYCUAJQAlAKlACUAIABQJLAACoigCUBQCAlAUAgFCFlAAgFACBQAJQAAAAMRpcSwFgsoAEAAoAQACrLEooQAEoQChKUBAKEAAoAHIAAgUCUACiAUIWCiAAUIUAgAFACKAAJQAAAgDFZp8RRFEoABAKAEAABKKBKAEoAQChLUoEBKACgAJYQAAsSgEoCkABKAoBAKELKABAKAEAUAQCgAABAGRNPissKQoAgAFACAAUIFAlACUAJQFlllIACUAFAAc9cgAQsoEAooEBKABRAAKLAAAQChACgEAoAAAQAUYjT4gAAAgAFACAUAIoAlACUIBQlWUCAUIABQAJLAAIoAgFKgAJQCgIBQBYACAUAILCgCAUAAAIAAyGnxAABAAAKEAAoRZQChAKEBAKEtAEABKACgAcgAFgIBQKIACUCiAUAWAAAgFCAKAAJQAAAgAUAxGnxABAAAKEAAAosSgEoASgBKEAtEEoChAASgJZUAEUAQCrLAASgLKBAKALAAQCgBApFhQoQAAAEAAURiNTiCAAAUAIABQFIACUIBQgFCLLFogAJQAAlAc9c0ALAASikpAASgKAQChCygAQChACgAEoAAAQAsoAEYjT4gAAAUIAABRYACUAJQAgFWWEpQgFCAAUIAksoIoAgFWUCAlAWUCAAlUAAgFACBQAIBQAAAgAUCIoxGnxAAAoAQACikssAoQAEoAShCihAASgAAoQBIULAQCgUQChACgEABKsoAEAoQAKABKAAAEAVKSyhLAGI0+IAFACAAAUqJQCUAIBQhYVYihQgAJQAUAISwgFAJQCgICUBYKIBQgCgCAUAIAUAgFAACAAAKAIAxGnxAoAQAAKsBRAASgBAKEApZFChAQCgABKAlhKAASgVLAASikoBAKEKAAQCgBAoAEoAAAQKQFASgQBiNPjAACAAUsFIACUAAJQgAVQlACAlAABQgBEKAIBRQIBQgCpYACUBZQIABQgUACAUAAAIWUllBCiAAMRp8YAQAACigQAEoAQChALUsAoQAEoAKEAASUABAKpAASgLKBAKEFAAQCgCxKAASgAAABAFAEAAAYjT4wAgAFFJZYAACUAJQAgVQgFCAlAABQgACAACUoCAAlAogAFCKAAJQAgCygFCAAAAAixQAIAAAxGnxhAAALQSkABKAEAoCxFChKAEBKAAEoACWAAQCrLAASgUQAChAoAEAoAQBQBKAAAAEAUAQAACgYjS4gABVgKIAACUAIBRYlFCAUAICUAAJQAEsAgFFAgAJVlAgAFCKAAIBQgBYKAJQAAAgBZQIAAABQMRpcQpAFilAQAAEoAQCqRKKEAoQAEoAKEAAJYBAKpAASgWBRAKELBUoEAoAQKRQChAAAQAAsoEAAAoAGJdLillJYClACAAgFACVZYAEloUIAACUAFCAAIIBVlAgAJVlAAgFCFlAAgFCAFlAAlAAACAAKAIABQAAMRpcSyhKoAQAEAoAASrLAASgoQAEoAASgAAQQC0AQEoCygAQEooAEAAoQBQBAKAAAEUCUBAAAKAABkl0uIFACAAAgFACUWAAUIBQgAJQAAlAASwCBVACAlAWUCAUIWUACAUAIWUACAUAAIAFIoCAAUAAADGmlxgABAAASgABLRAASgAoQAEoAKEAAJZAKsoEAoQsFEABKAoABAKELBQABKAAEAALKBAAAKAAABkNLjAACAAgFACBVCAAlACUAIBQAUIAASyAVQCAlAFAgFCFlAAgFACBQAJQAAAgAUACAAUAAAIAyGnxgBAAQCgALEtSgQChAASgBAKAChAAEELC0AQEoCgEAoQKABAKAEVKBAKAAAEALKCFEAoAAAAQC5DT4gAgAIBQABZQAgFCAAlACAUAJQAAIJVAICAVYKIABQhZSUgAFCAFAIBQAAAhYFCWWAAAUAAIABchp8QQAAEAopBCigBAKEABKAEoAQCgABECrKBAQCrKBAAKEUAQAChCwUASgAABAACygQACgAABAALkNPiACAAlAUEIsFoAgJQAUIACUAJQAAAiUWUgAIBVAIABVIACAAUIAoAlAAACAAFAIBQAAAAlAA//8QAFBABAAAAAAAAAAAAAAAAAAAA0P/aAAgBAQABBQJHh//EABQRAQAAAAAAAAAAAAAAAAAAALD/2gAIAQMBAT8BSx//xAAUEQEAAAAAAAAAAAAAAAAAAACw/9oACAECAQE/AUsf/8QAFBABAAAAAAAAAAAAAAAAAAAA0P/aAAgBAQAGPwJHh//EABkQAQEBAQEBAAAAAAAAAAAAAAFgcICQoP/aAAgBAQABPyGNbFsWwbFsGxbBsWxbBsXYWxbBsWxbBsXYWxbBsWxbBsXYWxbBsWxbBsWxdhbF2FsXYWxdhbF2FsWxdhbF2FsXYWxeUmxeUmxeUmxeUmxfRVsWxeUmxfDR8NH5jv/aAAwDAQACAAMAAAAQ999951Z4k0e++/8Ad74wQE8H/vAwFfvPpQwAQwgvgQ1+AgfwwnewFvvQ0PPfffbTeaPHPuv/AP7+sMAAMD/wkAZXzz4mIEMMBxEEX0oR38Jf0MBb3EFTz333n32kDR6rL/3/APrBABAf/wDLwEVPfv6QAQwwBIgV+AhO6QlfQBvvQwNvvfffVTfIHNvvv/f/AMEAEMT/AI6ACF+8+JABDDAWzCF/qA/5BG9jAe8pDU+O99999QgM0e+/9+/bBADDc/8AAwA3fPr5zAwwggiAF+4hfwQ3+QRvvAxPvsvfbfXQCCBtv/8A37u8EINX/wD4hCDW9+5BADDACRAE/iAf/hH9DBW9jBE/9x91J1QU8+2+/wD/AD68EAIMT/24AIX77xsAIMAIJMDewIz+ELXsFJ7mMDz6EH32lGADC777/wB+/vBAKB8/8oABM9+8rADBAGOIA/wG9/AD97Au+xDE+7BBdt1VAAuSuv8Affv8wAgxPvfKAgVv/KBwAwQksQF/QlPYQn/QxPvQwbPqQc/fSQeIpuvn/wD/AO/pACBU/wDfgA13P/KwAQwwgqBX+BnfwB/fwfvKQxPqoQw7faYBBnjvu/8A7/8ABCCBe/8ACAgctfvKQAwQ7ioF/SlPfwtfQ1PvQwfP4QQgOQRAANusv5//AL/EEIID714kIFT/AO7gCDDCCJA/oCc/gC9JAO+pBAe9JD08RA4AUW++39+/3hCCBG99+jDL8/8AFQAgQggqnPwnP6wl/YgvuQwHPgQQ3PKKBEtlnvv/AP79MEIIF736AMEn/wC+BCDBCCUA/wCgPf4RveQVvqQ1PqgQ1vPhHMAvnvv/AH//AHtBCAO996hCBg/87DSBCCCTd/CE/wDwVvY1vvIQrPwQw9PPnLIjuhvuf+u6QQAg9vfuAwD/AD75EIMEIIo7+kJX8EJ3sFbyEMT6MEMRz7OC7L6773//AO/5BCBT+9+5CCFe8/pGBDCCBf7AE9rAX9jB+4DDc+pBDU++z4a+qe/9/wD/AL2EMIEP/wB8DAD8/wDOYAgwwgt/qQleyQjaQxPqQxHPgQxPPqg8Mtrvv/fvv8QQgjTvf+gwA3PPoQAAwghn+wFvew1vQwHvawXPvQQVPv5w/vvqv/f/AP7UEMJTP73yoAMT/wA+BCBDCCD/AIQvPwQvfwVvuQRHuwQxPPvww/vtvvf/AP79EEIAH73/AMDAH+/+wjCDDCI1/DE97CW9jE+8BB0epDD0++rBB++2/wDf/wD70UEIBfb3+AMJX735kIEMIIB+kLz8EJ/0BT6kMH78EMPz78MADr773/8A+/5BCCBD89+gAX9+/s5CBDCAH/jG97Be9jBe8BDR+rBDE8+DBCy2+39//wD7bQwgA1fP+AwDfv8A6kIEMMABWkJT+EP/AJBe+5DAeqBDH88+DDCCe79//wD/AOkEMIA9T3/oIAXb36kIEMAADOMR3sF/2MHbikMT6kENTz5sMILz723/AO+9BDDAC/8AP2agA8P/AKmsAMMABSMpz+kL28FRagMHT6EEfz7oMEJLD3//AP8Av5QQwgAnvOYIwEfvfrSwAwgACgkvPwV/YwXvowTPuAQ1PvtwQglPP/8A75vGEMMIA/723IEJH73yEKAMAACoLT+EPzsET7kNTb4EEbz7bkEIBzz/AP8Av5wQQwgFv/PSQgRnfv7LwAwwABAgvOwBvQwFviQ3PsIQzPPiwQhlPPP/AP7/AFBBDCCP+8/gDCc/8+ITADDAAUCU/pCf5BG+sjA8+BBF8+/hDCa889/++zBBDTAW/wDPaQgQvfvcAQgQwwFIhnDwRvYUfvoQVPqgQ1PPuwQgtHPPfrtqQQwwAD//ACuAIEL/AM+xDCDDAAAqc/7Cf9BE+tDBM+hDP88/DBCYc8//AN88YQQwgHv/AH/kIMJz/wA8JDCDAAAYC87hG9jBW8hDc+rBDk8+/BDCQ88//HVFBDDCAH/8/wCQgQvfvaIwwgwAANFP6w1uQTnvAwfOgQQ3PvowwghPP/8AMEEEEMMDz/zz8EIEB/76gMAIEAADTz8Ef3MF7zEMDzoENTz7YMMJDz3/AP8AwQQQwwQLv/PkQAgPf/fgAwQwYAAPPOQ3vQwfvAwHOgQQ3PvgwQhLPP8A/sMEEMMMAL/3zuEIAb37/wADLADBCCY8/BHdrBW+pBU86BDM8+73ACE88/8A/QwQww6HPvfPIwQg/P8A79QMENMEIZT3sF7mMH7yEFz6tEPT7+MEJDzz/wDrBDDDDTAe/wDfOwQgHnf/ACtAMAMMgJbT8FPykFb6kMH6IEMBz7sEMJTzz/8A7DzDDTEc/wD/ADikAIH737+AIEIMEA4pzsNb0MD7yEH36kFfT77sEIJTz78uksMMMDD/AP8AfMoQgD/P7rwAgQgQENuv4wv8QXvrQxNvgQwvPvoQwlPPvv8A8EMMMCz7/wD48BBCE/8AP/NQAQwgRVnoowVvSxfuoQ1PogQ/PPuwQgnPP+/wyQwyMPPv/NIgQgsfv/8AgAAMIEVBb44EPbkFT7wsV76kMXz7oMMIbz3+usUMMOyz7/8A84DBCA38/wDCwAwwgcEvukwV/YwfvKA0PswQ/POowwglPPf/AMEMMMPzz7/zioEEIV7z/gMAMIJHwLaoEH7EMX7wMGz4EELT75MAITzz39kEMMMPz7//AMAjBCe/89vAAADCD1yOW/BX9rB++CBE+6BDE8+/BCAUs9//AAQwwwgvv/8AjwIEEb7/AM7gCAAhCBF6+epD+5DF+oDFc+BBHc+/vBCAU0//AKwwwwwAPu/dMAgUfvf/ACOAMAMEJ3z7b8EfyMFb50ND64kNzz7vMAYTj/8A/rDDDCIA7ptwAABHe98qDGACDBD506e9jepDB+qBBE+pBjc++rBCAQ8//wDwQwwgAAPaSAAgS3vPfKwwgAgQuRfvvqV/gQTvqAQfugAwfPvgQwlPPPw0QwwwgAACQAAgAZ/vPOgwAgAgQlYfvvfV+AQfvqQXPqAQ3PPqwQxjPP8A/vEMMIIADCAAAIEV7zzwMMINAJHd3z773/6kMD6wMF76EFfz64EEJLT7/wDpDDDCAAAAAAADBT+8/wCAwwgRtX//AHz773fyEFb7gMT6oEMTz7sEIIDT/wD7BDDCAAACDAACBfe+8uIDCCBSp3/98+99/tBB+8hDU+7BDU8+LDCAU9//AKxQwggAAAwgAAgV/vPOgAwggTvb3ffvPffoQX/rAwXPqYw1PvowwoPPf74awwwAAAg8gAgVd/uP4gQwAgZnfvf/ALz3vykFf6gMXz4EMXz68EIIxz//APpDDCAAADDCAADde+gfeBDCBACBe9++89/hjBD+gDd8jBDB8+/BCA88/wD/AOEMIIAAAL4L/8QAHBEBAAMBAQEBAQAAAAAAAAAAASBAUDBgEQAQ/9oACAEDAQE/EKhE/pEzDgUjDKxeKTjlM13+Gu0CiWTAK7QMM6lo7EDqZBAi5hwOhkGiQOBF/HYsmAXDq5BA6v47F02SmWjy5aLDoEDZMT5QNEgQIGGciBAgUjkTOxlnE4HYpHA6lIwiJ7X57EqnoSgci+cSZyKJxIlAtHIgcDNIHAzTUIEDVIGgWDBMEzzwRkFE9AbJgfNg2TwREgZP/8QAHBEBAAIDAQEBAAAAAAAAAAAAASAwEUBQEGBw/9oACAECAQE/ENl0XqnHYM8yIZ6px34NmVsHjvpNodF0XSeI+sz1gwYO+1nrzszPWDxG49zo51244zpHVYFTS6bW1Zg0MWt1mBU6rpNBJg/ONZ47mdPNBTnQzovr0WhrOU3lrFraGLLMG11M6OayLQ8diRfXkOqxeW6bp59fWDEozDPBfXrPPaXoMWbSTYO87byGhg0uyxeC7rQ9FozRmOeA7za3PVfXSeO6bF2WDB0mTa6DpMHhMG547PM2DSydjPBfxB5jSweq+vBdV9eC7DFpdJ0WDBixYOk2MWDBixYMGTQ1f//EAB8QAAEEAwEBAQEAAAAAAAAAAAEAETBAIDFQEEEhYP/aAAgBAQABPxDgBOjyyYQiUIXDO/rIWwnnPNpmQF00gcChYZHSEh0tshONc8cw8Bg8w1zxf+IRlE5wGAmGueNxDgl+QC189bg6TwikER40h5icYCN+8JS/EcxMMR/ECY4RIOcEeB+r9jKL9wH8E9tkyEp/lV6TTmcI3HT1bTNRa8FrxrbISnSJc4hNALAvDwco/wAqiiLn30VxVLNr4vhFDgPCTBE5CZk1ACcUhCKbJsGhPIcAYNmMBRKFweCMr9HITCr+3hcEumYmFD4vtQTC0T4E8h1RQdPUEbeNadBFBNGdI7yaZk1Bk0Zqjd4RlFxAm4QuBFCQv3IeNGJvuAlPSKEZMES5yEw1QCKGoDgaQRuuhKeIpiRk3AbxqAkZCQrbETjoBHAXChFpkJhfNMXxIeQlHRbwJ7reFNCSjumJPmA4ZCAtgJpTqNOB/ACYn4Y4IviXRHeI1dKFVpheGpDxGApCAeDhN4RcGkdIbmDgD+AHrQ6InATCUct5BKJSwE4oDcrVWTURIJi/aQojeQti+0p0vvrzCiy+5DE193no2zGY3QA8bgfEEfxDlF++iAZjdAcL4hwBGfwI79F8cL4heeU8BMPRCMRJ8rOnuAraaUvRONeiUcNkIhTeU6R9EQxGvR/GhHwoSxME2A5reDmE9D4hO3DdFPdEx0j4BMyEw473RXjN6AvhHwJkya6Ji/YhXGuEOCJDpHaHAGuGULvxBFCQUJhRHGdPbdBELUZLaEz0W4A8bBk1tlpBNHshME1AfwojP4MvkQ5/zxuIPDaDAcARsm83wXTSl+zDaKGAke+/hQvhMvsp0jM2PyUbyFn4n9N9+aCbgjfhQuhFDz7IV8Wwjj8X3hCU6R3MNSDEX2TeNwWQtmwaUDgbWrQzZMihKUwgEAvDAcIIoSncwwEg3wAih0DpGVkKAuHxkybwWfsD+CUpRvmsiEE/8Cag3APEFA7ui6deBHwVBMJzpG4Ov9lFDSVph438I2DyF+yCAQC8yfjCco7jaEfxgRQmJ/JRGMRdHHCM+kgwEgqDnsmQ82mlL9jFFpBQbxuK6+IJpzuMUXuOt1xQ+ITn8jak1wocYaR0hygvi586oXxxmTUTENUBMJgmX3jCkdRjVAXAV8X1FPI1gUjC3goC2EcG4gpEwCkKY6LeCidwii1MRBMnjFshCf4ijiMBQa23g9+9fSEUXQuDvB0wjxfnpQsGotdKHGdNTO82TyNgLz8dqZgdNOLgTeNdEAuBKMB/CBFCiIARQ9EIxFsVxQG/DSHhzbASDd1uO1QeHIUgbY8biBNWOshxhAOMF9rHIURdFn76IB3AojhP41k/pxGqITW38bkPVO8BSFoI+DunEUhKJRgOy3pTYDASi0EUOKya8GAkFMRsmQ8a+B69gnAYiQXRwwLh9GQwEAkFAYDgi2fRzxwxbOAovdCe2IGQiegTg1FqhhKa+PGTTiU79ak6e2/h6IlO+mUNcH4hbO+ePChYEA8GqBkOvRSaQTsn9F8IoaoGQ69ekJBO/u7zcA6qi2OD8RQ8++ffRT+4HwI5CL6hxfsf/9k=";

    /* ============================================================== */
    /* icons                                                          */
    /* ============================================================== */

    function AppleLogo() {
      return h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
        h('path', { d: 'M16.36 12.79c.02 2.44 2.14 3.25 2.17 3.26-.02.06-.34 1.17-1.13 2.31-.68.99-1.39 1.98-2.5 2-.99.02-1.3-.58-2.42-.58-1.12 0-1.47.57-2.4.6-1.07.04-1.89-1.07-2.58-2.05-1.4-2.03-2.47-5.74-1.03-8.25.71-1.24 1.99-2.02 3.37-2.04.96-.02 1.86.64 2.45.64.58 0 1.68-.79 2.83-.67.48.02 1.83.19 2.7 1.46-.07.04-1.61.94-1.6 2.81M14.57 5.1c.52-.63.87-1.5.77-2.37-.75.03-1.66.5-2.2 1.12-.48.55-.9 1.44-.79 2.29.84.06 1.7-.42 2.22-1.04' }));
    }

    function ChromeIcon() {
      const grad = ['chrome-orange', 'chrome-blue', 'chrome-red'];
      return h('svg', { viewBox: '0 0 64 64', 'aria-hidden': 'true' },
        h('defs', null,
          h('linearGradient', { id: 'chrome-orange', x1: '0', y1: '0', x2: '1', y2: '1' },
            h('stop', { offset: '0', stopColor: '#ffd04d' }), h('stop', { offset: '1', stopColor: '#ff9f1c' })),
          h('linearGradient', { id: 'chrome-blue', x1: '0', y1: '0', x2: '1', y2: '1' },
            h('stop', { offset: '0', stopColor: '#5fb4ff' }), h('stop', { offset: '1', stopColor: '#1a73e8' })),
          h('linearGradient', { id: 'chrome-red', x1: '0', y1: '0', x2: '1', y2: '1' },
            h('stop', { offset: '0', stopColor: '#ff6b6b' }), h('stop', { offset: '1', stopColor: '#e2362f' })),
          h('radialGradient', { id: 'chrome-orb', cx: '0.38', cy: '0.3', r: '0.8' },
            h('stop', { offset: '0', stopColor: '#9ecbff' }), h('stop', { offset: '1', stopColor: '#1f5fd6' }))),
        h('path', { d: 'M32 5a27 27 0 0 1 23.38 13.5H32a13.5 13.5 0 0 0-11.07 5.8L9.3 9.9A27 27 0 0 1 32 5z', fill: 'url(#chrome-red)' }),
        h('path', { d: 'M32 59a27 27 0 0 1-23.38-13.5l11.63-19.2A13.5 13.5 0 0 0 32 45.5c1.9 0 3.7-.4 5.32-1.1L27.9 57.9c-1.4.5-2.9.7-4.4.7z', fill: 'url(#chrome-orange)' }),
        h('path', { d: 'M54.5 21.5L43.3 40.4A13.5 13.5 0 0 0 45.5 32c0-2.4-.6-4.6-1.7-6.5h13.6c.3 1.3.4 2.6.4 4 0 4-1.2 7.7-3.3 10.8L37.9 58.6A27 27 0 0 0 58 35l-3.5-13.5z', fill: 'url(#chrome-blue)' }),
        h('circle', { cx: '32', cy: '32', r: '13.5', fill: '#fff' }),
        h('circle', { cx: '32', cy: '32', r: '10.8', fill: 'url(#chrome-orb)' }));
    }

    function WhalesIcon() {
      return h('svg', { viewBox: '0 0 64 64', 'aria-hidden': 'true' },
        h('defs', null,
          h('linearGradient', { id: 'whales-bg', x1: '0', y1: '0', x2: '1', y2: '1' },
            h('stop', { offset: '0', stopColor: '#7aa7ff' }),
            h('stop', { offset: '0.55', stopColor: '#4c6bfe' }),
            h('stop', { offset: '1', stopColor: '#2533c8' }))),
        h('rect', { x: '0', y: '0', width: '64', height: '64', rx: '14', fill: 'url(#whales-bg)' }),
        h('g', { transform: 'translate(9 9) scale(0.72)', fill: '#ffffff' },
          h('path', { d: 'M63.36 8.64C59.66 6.02 54.46 4.8 49.26 4.8c-5.3 0-10.5 1.24-14.2 3.86-1.3.9-2.36 2-3.06 3.3-5.6-.7-11.24-.32-16.3 1.32-5.9 1.9-10.9 5.6-14.1 10.9-1.4 2.3-2.4 4.9-2.9 7.7C-.4 37.6.5 43.2 3.6 47.9c3 4.5 7.9 7.7 14.1 8.9 6.2 1.2 13.4.5 19.4-2.2 4.4-2 8.2-5.2 10.9-9 2.6-3.8 4.1-8.2 4.1-12.8 0-1.5-.2-3-.5-4.4 2.6-1.4 5.4-2.2 8.2-2.2 1 0 2 .1 3 .3-1.4 1.9-2.3 4.2-2.5 6.6-.2 2.4.3 4.8 1.4 6.9l.9 1.7 1.7-.9c2.8-1.5 5.2-3.8 6.9-6.6 1.7-2.8 2.6-6 2.6-9.3 0-6.2-3.3-11.9-8.4-16.1z' })));
    }

    function FolderIcon() {
      return h('svg', { viewBox: '0 0 64 64', 'aria-hidden': 'true' },
        h('defs', null,
          h('linearGradient', { id: 'folder-back', x1: '0', y1: '0', x2: '0', y2: '1' },
            h('stop', { offset: '0', stopColor: '#67b3ff' }), h('stop', { offset: '1', stopColor: '#2f86f6' })),
          h('linearGradient', { id: 'folder-front', x1: '0', y1: '0', x2: '0', y2: '1' },
            h('stop', { offset: '0', stopColor: '#8ecbff' }), h('stop', { offset: '1', stopColor: '#4a9bf8' }))),
        h('path', { d: 'M6 15a4 4 0 0 1 4-4h14l4 5h22a4 4 0 0 1 4 4v8H6z', fill: 'url(#folder-back)' }),
        h('path', { d: 'M6 22h52a3 3 0 0 1 3 3.4l-3 22A4 4 0 0 1 54 51H10a4 4 0 0 1-4-3.6l-3.4-22A3 3 0 0 1 6 22z', fill: 'url(#folder-front)' }));
    }

    function TrashIcon() {
      return h('svg', { viewBox: '0 0 64 64', 'aria-hidden': 'true' },
        h('defs', null,
          h('linearGradient', { id: 'trash-body', x1: '0', y1: '0', x2: '0', y2: '1' },
            h('stop', { offset: '0', stopColor: '#f2f4f7' }), h('stop', { offset: '1', stopColor: '#c3c9d4' }))),
        h('path', { d: 'M16 20h32l-3 34a4 4 0 0 1-4 3.6H23a4 4 0 0 1-4-3.6z', fill: 'url(#trash-body)', stroke: 'rgba(0,0,0,.18)', strokeWidth: '1' }),
        h('rect', { x: '13', y: '15', width: '38', height: '5', rx: '2.5', fill: '#dfe4ec', stroke: 'rgba(0,0,0,.15)', strokeWidth: '1' }),
        h('path', { d: 'M24 12h16a2 2 0 0 1 2 2v1H22v-1a2 2 0 0 1 2-2z', fill: '#cfd6e1' }),
        h('path', { d: 'M25 26v25M32 26v25M39 26v25', stroke: 'rgba(0,0,0,.16)', strokeWidth: '2', strokeLinecap: 'round' }));
    }

    function WifiGlyph() {
      return h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
        h('path', { d: 'M12 18.6a1.6 1.6 0 1 0 0-.01zM12 12.9c1.7 0 3.3.6 4.6 1.7l1.4-1.6A10 10 0 0 0 12 10.2c-2.3 0-4.4.9-6 2.3l1.4 1.6c1.3-1.1 2.9-1.7 4.6-1.7M12 6.5c3 0 5.8 1.1 7.9 3l1.4-1.6A13.2 13.2 0 0 0 12 4.2c-3.5 0-6.7 1.4-9.3 3.7l1.4 1.6A11.7 11.7 0 0 1 12 6.5' }));
    }

    function BatteryGlyph() {
      return h('svg', { viewBox: '0 0 28 14', 'aria-hidden': 'true', style: { width: '24px', height: '13px' } },
        h('rect', { x: '1', y: '1', width: '22', height: '12', rx: '3', fill: 'none', stroke: 'rgba(255,255,255,.75)', strokeWidth: '1.5' }),
        h('rect', { x: '3', y: '3', width: '16', height: '8', rx: '1.5', fill: '#fff' }),
        h('path', { d: 'M25 5.5v3a2 2 0 0 0 0-3z', fill: 'rgba(255,255,255,.75)' }));
    }

    function SearchGlyph() {
      return h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
        h('path', { d: 'M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.3 4.3-1.4 1.4-4.3-4.3A7.5 7.5 0 1 1 10.5 3m0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11', fill: 'currentColor' }));
    }

    function KeyGlyph() {
      return h('svg', { viewBox: '0 0 8 8', 'aria-hidden': 'true' },
        h('path', { d: 'M0 0l8 8M8 0L0 8', stroke: 'currentColor', strokeWidth: '1.2', fill: 'none' }));
    }

    function MinusGlyph() {
      return h('svg', { viewBox: '0 0 8 8', 'aria-hidden': 'true' },
        h('path', { d: 'M0 4h8', stroke: 'currentColor', strokeWidth: '1.2', fill: 'none' }));
    }

    function ZoomGlyph() {
      return h('svg', { viewBox: '0 0 8 8', 'aria-hidden': 'true' },
        h('path', { d: 'M2 0v6h6', stroke: 'currentColor', strokeWidth: '1.2', fill: 'none' }),
        h('path', { d: 'M6 8V2H0', stroke: 'currentColor', strokeWidth: '1.2', fill: 'none' }));
    }

    function LaunchGlyph() {
      return h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
        h('path', { d: 'M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v9a2.5 2.5 0 0 1-2.5 2.5H15l-1.5 3h-3L9 17H5.5A2.5 2.5 0 0 1 3 14.5zM6 6h12M6 9h12M6 12h7', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round' }));
    }


    function AppTile(props) {
      // generic macOS app tile: squircle with a soft gradient, optional glyph
      const id = 'tile-' + props.name;
      return h('svg', { viewBox: '0 0 64 64', 'aria-hidden': 'true' },
        h('defs', null,
          h('linearGradient', { id, x1: '0', y1: '0', x2: '0', y2: '1' },
            h('stop', { offset: '0', stopColor: props.from }), h('stop', { offset: '1', stopColor: props.to }))),
        h('rect', { x: '4', y: '4', width: '56', height: '56', rx: '14', fill: 'url(#' + id + ')' }),
        h('g', { fill: 'none', stroke: props.ink || '#fff', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round' }, props.glyph));
    }

    function CodeIcon() {
      return AppTile({ name: 'code', from: '#3d7bff', to: '#1b3fd8', ink: '#fff',
        glyph: h('g', null, h('path', { d: 'M24 22L14 32l10 10' }), h('path', { d: 'M40 22l10 10-10 10' }), h('path', { d: 'M36 18l-8 28' })) });
    }

    function OfficeIcon() {
      return AppTile({ name: 'office', from: '#ff8f3c', to: '#e8571f', ink: '#fff',
        glyph: h('g', null,
          h('rect', { x: '16', y: '20', width: '14', height: '24', rx: '2' }),
          h('rect', { x: '34', y: '20', width: '14', height: '10', rx: '2' }),
          h('rect', { x: '34', y: '34', width: '14', height: '10', rx: '2' })) });
    }

    function NotesIcon() {
      return AppTile({ name: 'notes', from: '#c187ff', to: '#7b3fe4', ink: '#fff',
        glyph: h('g', null, h('path', { d: 'M22 20h20v24H22z' }), h('path', { d: 'M22 20l6-6h14v6' }), h('path', { d: 'M28 30h8M28 36h8' })) });
    }

    function TerminalIcon() {
      return AppTile({ name: 'terminal', from: '#4a4a52', to: '#1f1f24', ink: '#e8ffe8',
        glyph: h('g', null, h('path', { d: 'M20 24l8 8-8 8' }), h('path', { d: 'M32 40h12' })) });
    }


    // macOS System Settings: a grey rounded square with a machined gear
    function GearIcon() {
      const teeth = [];
      for (let i = 0; i < 8; i += 1) teeth.push(i * 45);
      return h('svg', { viewBox: '0 0 64 64', className: 'app-ic' },
        h('defs', null,
          h('linearGradient', { id: 'gearGrad', x1: '0', y1: '0', x2: '0', y2: '1' },
            h('stop', { offset: '0%', stopColor: '#a8adb8' }),
            h('stop', { offset: '100%', stopColor: '#6d727c' }))),
        h('rect', { x: '1', y: '1', width: '62', height: '62', rx: '14', fill: 'url(#gearGrad)' }),
        h('g', { fill: '#f7f8fa' },
          teeth.map((deg) => h('rect', {
            key: deg, x: '29.2', y: '7.5', width: '5.6', height: '8', rx: '1.6',
            transform: 'rotate(' + deg + ' 32 32)',
          })),
          h('circle', { cx: '32', cy: '32', r: '14.5' })),
        h('circle', { cx: '32', cy: '32', r: '7.2', fill: '#8b909a' }));
    }
    const ICONS = { chrome: ChromeIcon, whales: WhalesIcon, folder: FolderIcon, trash: TrashIcon,
      code: CodeIcon, office: OfficeIcon, notes: NotesIcon, terminal: TerminalIcon,
      gear: GearIcon };
    function AppIcon(props) {
      const C = ICONS[props.name] || FolderIcon;
      return h(C);
    }

    /* ============================================================== */
    /* app registry: every entry is a window around a plugin's surface */
    /* ============================================================== */

    // surface values drive the reconciler:
    //   none    - nothing to find yet; just show a placeholder in the window
    //   univer  - an .univer unit (iframe on the plugin's viewer)
    //   tab     - the plugin's native right-bar tab (kind), floated into the window
    //   stamp   - a node with a marker attribute (the plugin's overlay), floated into the window
    //   bridge  - the ego browser (needs the independent backend)
    //   static  - drawn by this plugin (trash, settings, pin manager)
    const DESKTOP_APPS = [
      { id: 'browser', label: '浏览器', icon: 'chrome', surface: { type: 'desk-browser' }, ego: true },
      { id: 'code', label: '代码', icon: 'code', surface: { type: 'pane' }, pane: 'code' },
      { id: 'office', label: 'Office', icon: 'office', surface: { type: 'univer' } },
      { id: 'notes', label: '笔记', icon: 'notes', surface: { type: 'notes' } },
      { id: 'finder', label: '访达', icon: 'folder', surface: { type: 'finder' } },
      { id: 'terminal', label: '终端', icon: 'terminal', surface: { type: 'terminal' } },
      { id: 'settings', label: '设置', icon: 'gear', surface: { type: 'static' } },
    ];
    const APP_BY_ID = {};
    DESKTOP_APPS.forEach((a) => { APP_BY_ID[a.id] = a; });

    // Desktop-mode pane: the desktop opens each software as its own child page
    // (`/?dsh-macos-pane=<pane>`), and that child renders exactly one plugin surface. Two reasons
    // this beats floating the native panel:
    //   - the plugin keeps its real DOM (Monaco, Univer, ego's live frame), so it stays interactive;
    //   - nothing of the desktop is inside the page ego films, so the preview cannot recurse.
    const PANE_PARAM = 'dsh-macos-pane';
    // A pane page opens exactly one right-bar tab and shows it full-bleed. `browser` is intentionally
    // absent: ego's live view inside a second page would capture that page, which captures itself —
    // the browser needs its own backend (Host `/api/macos-ego/*`), not an iframe.
    const PANES = {
      // ego's own watch tab: the native panel IS a real browser viewport (scroll/click/type land in
      // the page itself), so the browser window floats it instead of showing a picture.
      browser: { project: 'dsh-ego-browser', label: 'Agent Browser · Live', kind: 'ego-browser:watch', ready: '[class*="ego-side-root"]' },
      code: { project: 'dsh-code-workbench', label: '代码工作台', kind: 'code-workbench', ready: '.code-workbench' },
      notes: { project: 'dsh-obsidian-notes', label: '笔记', ready: '[class*="obsidian"]' },
      office: { project: "dsh-univer-office", label: "Office", kind: "univer", ready: 'iframe, [class*="uvf_"], [class*="univer"]' },
    };
    function currentPane() {
      try {
        const v = new URLSearchParams(window.location.search).get(PANE_PARAM);
        return v && PANES[v] ? v : null;
      } catch (e) { return null; }
    }
    function paneUrl(id) { return '/?' + PANE_PARAM + '=' + encodeURIComponent(id); }

    function ensurePaneDom(pane) {
      const root = document.documentElement;
      if (!root.hasAttribute('data-macos-pane')) root.setAttribute('data-macos-pane', pane);
      if (document.getElementById('macos-pane-css')) return;
      const style = document.createElement('style');
      style.id = 'macos-pane-css';
      style.textContent = PANE_CSS;
      (document.head || root).appendChild(style);
    }

    // Only the plugin's own right-bar seat survives in a pane page; everything the shell draws
    // around a conversation (sidebar, header, composer, dock strips) is removed.
    const SEAT = 'sidebar.right.pane.tab';
    const PANE_CSS = [
      // The shell keeps its layout: ego's workspace view (or any panel that reads the window) must
      // still see a normal page. Only what paints over the plugin is removed.
      'html[data-macos-pane] body { margin: 0; background: #fff; }',
      'html[data-macos-pane] [class*="_sidebarCol"], html[data-macos-pane] [class*="_centerCol"],',
      'html[data-macos-pane] [class*="_centerColumn"], html[data-macos-pane] [data-shell-bottom],',
      'html[data-macos-pane] [data-dockkit-host="tabstrip"] { visibility: hidden !important; }',
      'html[data-macos-pane] [data-shell-overlay] > .macos-overlay { display: none !important; }',
      'html[data-macos-pane] .macos-pane-frame { border: 0 !important; }',
      'html[data-macos-pane] .macos-pane { position: fixed !important; inset: 0 !important; border-radius: 0 !important; }',
    ].join('\n');

    // The pane mounts itself in its own body as a fixed child of a desktop-rooted <html>, so nothing
    // of the host shell needs to be hidden: the whole surface is the plugin's own view.
    function MountPane(props) {
      const pane = props.pane;
      const def = PANES[pane];
      const [state, setState] = useState('waiting');
      useEffect(() => {
        // Nothing renders in the right bar until its tab is opened; a pane page is only ever this
        // one tab, so open it as soon as the registry exists (the plugin mounts it lazily).
        let opened = false;
        const timer = window.setInterval(() => {
          if (opened || !def.kind) { window.clearInterval(timer); return; }
          const tabs = svc('sidebarRightTabs');
          const side = svc('sidebarRight');
          if (!tabs || !side) return;
          try {
            if (!tabs.get(def.kind)) return;
            side.openTab(def.kind);
            opened = true;
            window.clearInterval(timer);
          } catch (e) { /* registry not ready; retry on the next beat */ }
        }, 200);
        return () => window.clearInterval(timer);
      }, []);
      useEffect(() => {
        const started = Date.now();
        const timer = window.setInterval(() => {
          if (document.querySelector(def.ready)) { setState('ready'); window.clearInterval(timer); }
          else if (Date.now() - started > 20000) setState('slow');
        }, 250);
        return () => window.clearInterval(timer);
      }, []);
      // Shell pieces that must disappear in a child page are hidden synchronously: waiting for an
      // effect would let the full shell paint (and its observers run) first. Nothing is restored on
      // unmount — child pages never go back to being the shell.
      ensurePaneDom(pane);
      return h('div', { className: 'macos-pane' + (state === 'ready' ? ' ready' : ''), 'data-macos-pane': pane },
        state === 'ready' ? null : h('div', { className: 'macos-pane-wait' },
          h('div', { className: 'macos-pane-spin' }),
          h('div', { className: 'macos-pane-title' }, def.label),
          h('div', { className: 'macos-pane-sub' }, state === 'slow' ? '插件面板没有挂载（' + def.project + '）' : '正在启动…')));
    }

    /* ============================================================== */
    /* store                                                          */
    /* ============================================================== */

    const S = {
      active: false,
      windows: {},
      order: [],
      focused: null,
      minimized: {},
      zoomed: {},
      now: new Date(),
      desktopSelected: null,
      egoStatus: 'idle',
      modal: null,
      chat: false,        // native conversation floated over the desktop
      launchpad: false,   // app grid (F4)
      spotlight: false,   // ⌘Space search
      control: false,     // control centre
    };
    let zSeq = 0;
    const listeners = new Set();
    let hostCtx = null;
    let zCounter = 10;

    function emit() { listeners.forEach((fn) => { try { fn(); } catch (e) { /* one bad listener must not break the desktop */ } }); }
    // useSyncExternalStore compares snapshots by identity: publish a shallow copy per change, or a
    // freshly mounted root (the desktop lives in its own root) never sees later updates.
    let snap = { ...S };
    function getSnap() { return snap; }
    function subscribe(fn) { listeners.add(fn); return () => { listeners.delete(fn); }; }
    function setState(patch) { Object.assign(S, patch); snap = { ...S }; emit(); }
    function useS() { return useSyncExternalStore(subscribe, getSnap, getSnap); }
    function nextZ() { zCounter += 1; return zCounter; }
    function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
    function vp() { return { w: window.innerWidth || 1280, h: window.innerHeight || 800 }; }
    function pad2(n) { return n < 10 ? '0' + n : String(n); }
    // The shell's own ego HTTP layer (/api/ego/*), the same one the watch panel uses.
    async function egocall(path, body) {
      const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}), cache: 'no-store' });
      const text = await r.text();
      try { return JSON.parse(text); } catch { return text; }
    }

    // File text for the apps that draw their own editors (notes, settings previews…).
    async function readTextFile(rel) {
      const r = await fetch('/api/macos-desktop/read?path=' + encodeURIComponent(rel), { cache: 'no-store', credentials: 'same-origin' });
      if (!r.ok) return '';
      try { const j = await r.json(); return (j && (j.text || '')) || ''; } catch { return ''; }
    }
    async function writeTextFile(rel, text) {
      const r = await fetch('/api/macos-desktop/write', {
        method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path: rel, text }),
      });
      const t = await r.text();
      try { return JSON.parse(t); } catch { return { ok: r.ok, text: t }; }
    }

    function svc(name) {
      const c = hostCtx;
      if (!c) return null;
      try { return c.get(name) || null; } catch (e) { return null; }
    }

    function darkNow() { return !!(document.body && document.body.hasAttribute('data-ds-dark-theme')); }
    // 设置 can force light/dark; otherwise follow the shell's own theme
    function effectiveDark() {
      const forced = document.documentElement && document.documentElement.getAttribute('data-macos-theme');
      if (forced === 'dark') return true;
      if (forced === 'light') return false;
      return darkNow();
    }

    function useDark() {
      const [dark, setDark] = useState(effectiveDark);
      useEffect(() => {
        if (typeof MutationObserver !== 'function') return undefined;
        const obs = new MutationObserver(() => setDark(effectiveDark()));
        obs.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-macos-theme'] });
        return () => obs.disconnect();
      }, []);
      return dark;
    }

    function token(name, fallback) {
      try {
        const v = getComputedStyle(document.body).getPropertyValue(name).trim();
        return v || fallback;
      } catch (e) { return fallback; }
    }
    function readTokens() {
      return {
        bg: token('--dsw-alias-bg-base', '#ffffff'),
        layer1: token('--dsw-alias-bg-layer-1', '#f7f7f8'),
        label: token('--dsw-alias-label-primary', '#1d1d1f'),
        label2: token('--dsw-alias-label-secondary', '#6b6b70'),
        border: token('--dsw-alias-border-l1', 'rgba(0,0,0,.10)'),
      };
    }
    function useTokens() {
      const dark = useDark();
      const [tokens, setTokens] = useState(readTokens);
      useEffect(() => { setTokens(readTokens()); }, [dark]);
      return tokens;
    }

    /* ---------------- window management ---------------- */

    function isCompact() { return vp().w < 760; }

    function defaultRect() {
      const v = vp();
      if (isCompact()) return { x: 0, y: MENUBAR_H, w: v.w, h: v.h - MENUBAR_H - 62 };
      const availH = v.h - MENUBAR_H;
      const w = clamp(Math.round(v.w * 0.86), 520, 1600);
      const ht = clamp(Math.round(availH * 0.88), 360, 1100);
      return {
        x: Math.round((v.w - w) / 2),
        y: MENUBAR_H + Math.max(10, Math.round((availH - ht) / 2)),
        w,
        h: ht,
      };
    }

    function openApp(appId) {
      const existing = S.windows[appId];
      if (existing) {
        setState({
          focused: appId,
          desktopSelected: null,
          minimized: Object.assign({}, S.minimized, { [appId]: false }),
          windows: Object.assign({}, S.windows, { [appId]: Object.assign({}, existing, { z: nextZ() }) }),
        });
        return;
      }
      const r = defaultRect();
      setState({
        windows: Object.assign({}, S.windows, { [appId]: Object.assign({}, r, { z: nextZ() }) }),
        order: S.order.indexOf(appId) < 0 ? S.order.concat([appId]) : S.order,
        focused: appId,
        minimized: Object.assign({}, S.minimized, { [appId]: false }),
        desktopSelected: null,
      });
    }

    function focusApp(appId) {
      if (!S.windows[appId]) return;
      if (S.focused === appId && !S.minimized[appId]) return;
      setState({
        focused: appId,
        minimized: Object.assign({}, S.minimized, { [appId]: false }),
        desktopSelected: null,
        windows: Object.assign({}, S.windows, { [appId]: Object.assign({}, S.windows[appId], { z: nextZ() }) }),
      });
    }

    function patchWin(appId, patch) {
      if (!S.windows[appId]) return;
      setState({ windows: Object.assign({}, S.windows, { [appId]: Object.assign({}, S.windows[appId], patch) }) });
    }

    function closeApp(appId) {
      if (!S.windows[appId]) return;
      const windows = Object.assign({}, S.windows);
      delete windows[appId];
      const order = S.order.filter((id) => id !== appId);
      const rest = order.filter((id) => !S.minimized[id]);
      setState({ windows, order, focused: S.focused === appId ? (rest[rest.length - 1] || null) : S.focused });
    }

    function minimizeApp(appId) {
      if (!S.windows[appId]) return;
      setState({
        minimized: Object.assign({}, S.minimized, { [appId]: true }),
        focused: S.focused === appId ? null : S.focused,
      });
    }

    function toggleZoom(appId) {
      if (!S.windows[appId]) return;
      setState({ zoomed: Object.assign({}, S.zoomed, { [appId]: !S.zoomed[appId] }) });
    }

    function quitDesktop() { setActive(false); }

    /* ============================================================== */
    /* the native shell                                               */
    /* ============================================================== */

    let overlaySeat = null;
    let parked = [];

    function findFrame() {
      const shell = document.querySelector('[data-shell-overlay]');
      if (shell && shell.closest('[data-macos-desktop-host]') === null) return shell.parentElement;
      // the empty seat we were mounted in: walk up to the shell frame that owns the ego panel
      const seat = overlaySeat;
      const panel = findPanel();
      if (seat && panel && panel.parentElement !== seat.parentElement) {
        let el = panel.parentElement;
        while (el && el.parentElement && el.parentElement !== document.body) el = el.parentElement;
        if (el && el !== seat.parentElement) return el;
      }
      return seat ? seat.parentElement : null;
    }

    // The visible surface is the panel (it carries the open/fullscreen attributes and the width);
    // its parent session wrapper only holds the geometry we publish.
    function findPanel() {
      const all = document.querySelectorAll('[data-sidebar-right-session]');
      let session = null;
      for (let i = 0; i < all.length; i += 1) {
        const el = all[i];
        if (el.closest('[data-shell-overlay]') !== null || el.closest('[data-macos-desktop-host]')) continue;
        if (el.hasAttribute('data-sidebar-right-panel')) return el;
        if (!session) session = el;
      }
      return session;
    }
    function panelForSurface() {
      const panel = findPanel();
      if (panel && !panel.hasAttribute('data-sidebar-right-panel')) return panel.firstElementChild || panel;
      return panel;
    }

    // Park the native shell off-screen (it must stay laid out: the ego panel lives inside it).
    // Park the frame itself, never a slot seat (those carry `display: contents` inline, which
    // would drop the transform entirely and leave the shell on screen).
    // The shell is parked by moving it out of the flow with the margin box, not by a transform: a
    // transformed ancestor would make the ego live frame (a DOM node we move into the desktop) be
    // re-rasterized at a different size, and the picture would nest on itself.
    function parkOne(el) {
      if (!el || el.__macosParked) return;
      el.__macosParked = {
        transform: el.style.transform,
        transition: el.style.transition,
        marginLeft: el.style.marginLeft,
        visibility: el.style.visibility,
      };
      el.style.transition = 'none';
      el.style.transform = 'none';
      el.style.marginLeft = PARK_SHIFT;
      el.style.visibility = 'visible';
      parked.push(el);
    }
    function parkShell() {
      const host = document.querySelector('[data-macos-desktop-host]');
      if (host) host.style.display = '';
      const frame = findFrame();
      if (frame) parkOne(frame);
      // our own seat lives inside that same frame, so it rides along; nothing else to do
    }
    function unparkShell() {
      // the desktop layer lives inside the parked frame; tear it down before the frame comes back
      unmountDesktopRoot();
      parked.forEach((el) => {
        const prev = el.__macosParked || {};
        el.style.transition = 'none';
        el.style.transform = prev.transform || '';
        el.style.transition = prev.transition || '';
        el.style.marginLeft = prev.marginLeft || '';
        el.style.visibility = prev.visibility || '';
        el.__macosParked = null;
      });
      parked = [];
    }

    function egoRight() { return svc('sidebarRight'); }

    function sessionIdOf(right) {
      try {
        const o = right.mounted;
        const v = o && typeof o.get === 'function' ? o.get() : o && o.value;
        return typeof v === 'string' ? v : null;
      } catch (e) { return null; }
    }

    // "Present" means the tab really exists in the surface. Resolving the surface is the check:
    // tabsIn() may report a stale tab while the surface is still coming up, and then openTab()
    // silently lands on a surface with nothing to host the ego view.
    function egoTabPresent(right) {
      try {
        const sid = sessionIdOf(right);
        if (!sid) return true;
        const surface = right.adopted && right.adopted.get ? right.adopted.get(sid) : null;
        if (!surface) return false;
        const list = right.tabsIn(sid) || [];
        if (list.some((t) => t && t.kind === EGO_KIND)) return true;
        // a live ego view anywhere in the panel means the tab is there, whatever the registry says
        return !!document.querySelector('[data-sidebar-right-panel] [class*="ego-side-root"]');
      } catch (e) { return true; }
    }

    function ensureFullscreen(right) {
      const sid = sessionIdOf(right);
      if (!sid) return;
      try {
        const surface = right.adopted && right.adopted.get ? right.adopted.get(sid) : null;
        const actions = surface && surface.store ? surface.store.actions : null;
        const mode = surface && surface.layout ? surface.layout.mode : null;
        if (actions && typeof actions.setMode === 'function' && mode !== 'fullscreen') actions.setMode(sid, 'fullscreen');
      } catch (e) { /* dockkit surface may not be ready yet */ }
    }

    // Called on every tick and on every store change while the desktop runs.
    const opened = {};

    // Every plugin surface the desktop needs is opened exactly once in the native right bar; CSS
    // floats that tab body over the matching window, so closing a window only hides the float.
    function reconcile() {
      installHook();
      const root = document.documentElement;
      if (!S.active) {
        if (root.hasAttribute('data-macos-ego')) root.removeAttribute('data-macos-ego');
        return;
      }
      parkShell();
      const right = egoRight();
      if (!right) return;
      appRegistry().forEach((app) => {
        const surface = app.surface;
        if (!surface || surface.type !== 'tab') return;
        const want = !!S.windows[app.id];
        if (!want) { if (opened[app.id]) opened[app.id] = false; return; }
        const present = tabPresent(right, surface.kind, surface);
        if (!present && !opened[app.id]) {
          try { right.openTab(surface.kind); opened[app.id] = true; } catch (e) { /* surface not mounted yet */ }
        }
      });
      ensureFullscreen(right);
      if (S.windows.browser && !egoStatusSet && egoDomReady(findPanel())) markEgoReady();
      root.setAttribute('data-macos-ego', S.windows.browser ? 'on' : 'off');
    }

    function tabPresent(right, kind, surface) {
      try {
        const sid = sessionIdOf(right);
        const surfaceRec = sid && right.adopted && right.adopted.get ? right.adopted.get(sid) : null;
        if (!surfaceRec) return false;
        const list = right.tabsIn(sid) || [];
        if (list.some((t) => t && (t.kind === kind || (surface.id && t.id === surface.id)))) return true;
        const panel = panelForSurface();
        if (!panel) return false;
        return !!panel.querySelector('[data-sidebar-right-tab="' + kind + '"]');
      } catch (e) { return false; }
    }

    // geometry of the hole the ego panel must fill, published as CSS vars on the panel
    let lastGeo = '';
    // Where the native plugin panel goes: exactly over the body of the focused pane-app window.
    // With no such window it is parked (clipped into a corner, still laid out so ego keeps
    // streaming).
    // Where the native plugin panel goes: exactly over the body of the focused pane-app window.
    // The panel hands out app focus to whoever clicked inside it, and while no pane-app window
    // owns it, it is parked (clipped into a corner — still laid out so ego keeps streaming).
    function syncPanelGeometry() {
      const panel = panelForSurface();
      if (!panel) return;
      const inPane = !!currentPane();
      const hosts = document.querySelectorAll('[data-macos-panehost]');
      const focusedId = S.focused;
      let target = null;
      for (let i = 0; i < hosts.length; i += 1) {
        const el = hosts[i];
        const appId = el.getAttribute('data-macos-panehost');
        const win = S.windows[appId];
        if (!win || S.minimized[appId]) continue;
        if (appId === focusedId) { target = el; break; }
        if (!target) target = el;
      }
      const live = !inPane && !!target;
      const state = live ? 'live' : 'parked';
      if (document.documentElement.getAttribute('data-macos-panel') !== state) {
        document.documentElement.setAttribute('data-macos-panel', state);
      }
      if (!live) return;
      const r = target.getBoundingClientRect();
      const inset = String(target.getAttribute('data-macos-pane-inset') || '').split(/\s+/).map((v) => parseFloat(v) || 0);
      const top = r.top + (inset[0] || 0);
      const right = inset[1] || 0;
      const bottom = inset[2] || 0;
      const left = inset[3] || 0;
      const key = [Math.round(r.left + left), Math.round(top), Math.round(r.width - left - right), Math.round(r.height - (inset[0] || 0) - bottom)].join(',');
      if (key === lastGeo) return;
      lastGeo = key;
      panel.style.setProperty('--mac-x', Math.round(r.left + left) + 'px');
      panel.style.setProperty('--mac-y', Math.round(top) + 'px');
      panel.style.setProperty('--mac-w', Math.round(r.width - left - right) + 'px');
      panel.style.setProperty('--mac-h', Math.round(r.height - (inset[0] || 0) - bottom) + 'px');
    }

    // A click deep inside the native panel must not steal the desktop's attention away from the
    // window that hosts it: the panel's own focus events are re-attributed to its owner.
    function reroutePanelFocus() {
      const panel = panelForSurface();
      if (!panel || panel.__macosFocusRouted) return;
      panel.__macosFocusRouted = true;
      const owner = () => {
        const el = panel.closest('body') && document.querySelector('[data-macos-panehost]');
        return el ? el.getAttribute('data-macos-panehost') : null;
      };
      const settle = () => {
        const appId = owner();
        if (appId && S.active && S.focused && S.focused !== appId) focusApp(appId);
      };
      panel.addEventListener('pointerdown', () => { window.setTimeout(settle, 0); }, true);
      panel.addEventListener('focusin', () => { window.setTimeout(settle, 0); }, true);
    }

    function setActive(next) {
      if (next === S.active) return;
      const root = document.documentElement;
      if (next) {
        setState({
          active: true,
          windows: {},
          order: [],
          focused: null,
          minimized: {},
          zoomed: {},
          desktopSelected: null,
          modal: null,
          now: new Date(),
        });
        parkShell();
        root.setAttribute('data-macos-panel', 'parked');
        root.setAttribute('data-macos-desktop', '');
        // enter on a clean desktop: every window is opened from the Dock or a desktop icon
        if (isCompact()) openApp('chat');
        mountDesktopRoot();
        reconcile();
      } else {
        setState({ active: false, windows: {}, order: [], focused: null, minimized: {}, zoomed: {}, modal: null });
        root.removeAttribute('data-macos-desktop');
        root.removeAttribute('data-macos-ego');
        root.removeAttribute('data-macos-panel');
        unparkShell();
        lastGeo = '';
        egoStatusSet = false;
        setState({ egoStatus: 'idle' });
        const panel = findPanel();
        if (panel) ['--mac-x', '--mac-y', '--mac-w', '--mac-h'].forEach((k) => panel.style.removeProperty(k));
        try {
          const right = egoRight();
          if (right) {
            const sid = sessionIdOf(right);
            const surface = sid && right.adopted && right.adopted.get ? right.adopted.get(sid) : null;
            const actions = surface && surface.store ? surface.store.actions : null;
            if (actions && typeof actions.setMode === 'function') actions.setMode(sid, 'push');
          }
        } catch (e) { /* ignore */ }
      }
    }

    /* ============================================================== */
    /* desktop root: a second React root, teleported onto <body>      */
    /* ============================================================== */

    let desktopHost = null;
    let desktopRoot = null;

    // The host is a fixed, viewport-sized layer. It is parented to the parked native frame (when
    // one exists) so the React tree keeps riding along with the shell it decorates, and so the
    // chat window can re-mount the native conversation straight from the slot node it was given.
    let rootMountedAt = 0;
    function mountDesktopRoot() {
      // persisted appearance/behaviour lands before the first paint of the desktop
      try { applySettings(loadSettings()); } catch (e) { /* storage unavailable */ }
      if (desktopRoot) return;
      rootMountedAt = Date.now();
      if (!ReactDOM || typeof ReactDOM.createRoot !== 'function' || typeof ReactDOM.createPortal !== 'function') return;
      // Parented to <body>: a fixed layer outside any transformed/parked ancestor, so positions are
      // viewport coordinates and ego's live view is not re-rasterized under a transform.
      const host = document.createElement('div');
      host.className = 'macos-desktop-host';
      host.setAttribute('data-macos-desktop-host', '');
      document.body.appendChild(host);
      desktopHost = host;
      desktopRoot = ReactDOM.createRoot(host);
      desktopRoot.render(ReactDOM.createPortal(h(Desktop), host));
    }
    function unmountDesktopRoot() {
      egoStatusSet = false;
      const root = desktopRoot;
      const host = desktopHost;
      desktopRoot = null;
      desktopHost = null;
      if (root) {
        try { root.unmount(); } catch (e) { /* ignore */ }
      }
      if (host && host.isConnected) host.remove();
    }

    // Fallback when a second React root is unavailable: render inline in the slot seat and hide
    // the ego panel (no floating browser).
    function DesktopSeat() {
      return h('div', { className: 'macos-desktop', style: { pointerEvents: 'auto' } }, h(Desktop));
    }

    /* ============================================================== */
    /* ego bridge                                                     */
    /* ============================================================== */

    // ego's tab body draws nothing while the browser window is open: its view is the floating
    // native panel (CSS). The bridge only keeps that view mounted and reports readiness.
    let CURRENT_SESSION = null;

    // The harness keeps the visible session in localStorage; Univer's viewer route needs it.
    // blank by default: the user asked us to stop forcing a search engine home page
    function startPage() {
      try {
        const saved = JSON.parse(window.localStorage.getItem('macos-desktop.settings.v1') || '{}');
        if (saved && typeof saved.startPage === 'string' && saved.startPage.trim()) return saved.startPage.trim();
      } catch (e) { /* ignore */ }
      return 'about:blank';
    }

    function sessionId() {
      try {
        const stored = window.localStorage.getItem('dsh.sessions.current');
        if (stored) {
          // the store keeps {"sessionId":"…"}; older builds wrote a bare id
          const text = stored.trim();
          if (text.charAt(0) === '{') {
            const parsed = JSON.parse(text);
            if (parsed && parsed.sessionId) return String(parsed.sessionId);
          } else if (text) return text;
        }
      } catch (e) { /* ignore */ }
      return CURRENT_SESSION || '';
    }

    let egoDef = null;
    let egoStatusSet = false;

    function markEgoReady() {
      window.__markFlag = (window.__markFlag || 0) + 1;
      if (egoStatusSet) return;
      egoStatusSet = true;
      setState({ egoStatus: 'ready' });
    }

    // The panel has no tab body for us to observe, so readiness is its DOM: ego's own stage
    // element only exists once its view mounted in the tab.
    function egoDomReady(panel) {
      if (!panel) return false;
      const view = panel.querySelector('[class*="ego-side-root"]');
      if (!view) return false;
      const r = view.getBoundingClientRect();
      return r.height > 60 || view.children.length > 0;
    }

    // ego owns its tab type; we only learn the definition (used to know it exists). A second
    // registration is impossible and wrapping would make the native panel paint a nested desktop.
    function installHook() {
      const tabs = svc('sidebarRightTabs');
      if (!tabs) return;
      try {
        const def = typeof tabs.get === 'function' ? tabs.get(EGO_KIND) : null;
        if (def) egoDef = def;
      } catch (e) { /* registry not ready */ }
    }

    /* ============================================================== */
    /* chrome shared by the desktop layer and the floating strips     */
    /* ============================================================== */

    function useClock(intervalMs) {
      const [, tick] = useState(0);
      useEffect(() => {
        const t = window.setInterval(() => { setState({ now: new Date() }); tick((n) => n + 1); }, intervalMs || 20000);
        return () => window.clearInterval(t);
      }, [intervalMs]);
      return S.now;
    }

    function MenuRow(props) {
      return h('div', { className: 'macos-menu-row', role: 'menuitem', onClick: props.onClick },
        props.label, props.hint ? h('span', { className: 'macos-menu-hint' }, props.hint) : null);
    }

    const APP_MENUS = {
      finder: [['新建窗口', '⌘N'], ['打开设置…'], ['清空废纸篓', '⇧⌘⌫']],
      browser: [['新建标签页', '⌘T'], ['关闭标签页', '⌘W'], ['重新载入页面', '⌘R'], ['复制当前网址', '⌘L'], ['连接 Chrome 登录']],
      chat: [['新建对话', '⌘N'], ['清空当前对话'], ['切换模型'], ['导出对话']],
      trash: [['清空废纸篓', '⇧⌘⌫']],
    };

    function Menubar(props) {
      const s = useS();
      const now = useClock(15000);
      const [open, setOpen] = useState(null);
      const menuRef = useRef(null);
      const barRef = useRef(null);
      useEffect(() => {
        if (!open) return undefined;
        const close = (e) => {
          if (menuRef.current && menuRef.current.contains(e.target)) return;
          if (barRef.current && barRef.current.contains(e.target)) return;
          setOpen(null);
        };
        window.addEventListener('pointerdown', close);
        return () => window.removeEventListener('pointerdown', close);
      }, [open]);
      const appId = s.focused || (s.windows.browser ? 'browser' : (s.windows.chat ? 'chat' : (s.windows.trash ? 'trash' : 'finder')));
      const names = { finder: 'Finder', browser: 'Ego Browser', chat: 'DeepSeek', trash: '废纸篓' };
      const strip = !!props.strip;
      const barProps = strip ? { 'data-macos-chrome': '1' } : null;
      const menuItems = ['文件', '编辑', '显示', '前往', '窗口', '帮助'];
      const rows = open && open !== 'apple' ? (open === '文件' ? (APP_MENUS[appId] || []) : [['（暂无菜单项）']]) : null;
      const isOpen = (name) => (open === name ? ' open' : '');
      return h('div', { className: 'macos-menubar', ...barProps, ref: barRef },
        h('div', {
          className: 'macos-menu-item apple' + (open === 'apple' ? ' open' : ''),
          'data-macos-chrome': '1',
          onPointerDown: (e) => { e.stopPropagation(); setOpen(open === 'apple' ? null : 'apple'); },
        }, h(AppleLogo)),
        h('div', { className: 'macos-menu-item appname' + isOpen('关于'), 'data-macos-chrome': '1', onPointerDown: (e) => { e.stopPropagation(); setOpen('关于'); } }, names[appId] || 'Finder'),
        menuItems.map((m) => h('div', {
          key: m,
          className: 'macos-menu-item hide-sm' + isOpen(m),
          onPointerDown: (e) => { e.stopPropagation(); setOpen(open === m ? null : m); },
        }, m)),
        h('div', { className: 'macos-menubar-spacer' }),
        h('div', { className: 'macos-status' },
          h('span', {
            'data-macos-chrome': '1',
            className: 'macos-status-badge',
            title: 'ego-lite ' + (s.egoStatus === 'ready' ? '已连接' : '等待中'),
            onPointerDown: (e) => { e.stopPropagation(); setOpen(open === 'ego' ? null : 'ego'); },
          }, h('span', { className: 'macos-dot' + (s.egoStatus === 'ready' ? '' : ' warn') }), 'ego'),
          h('span', { className: 'macos-status-ic', title: '网络', 'data-macos-chrome': '1' }, h(WifiGlyph)),
          h('span', { className: 'macos-status-ic', title: '电池', 'data-macos-chrome': '1' }, h(BatteryGlyph)),
          h('span', {
            className: 'macos-status-ic',
            title: '控制中心',
            'data-macos-chrome': '1',
            onPointerDown: (e) => { e.stopPropagation(); setOpen(null); setState({ control: !S.control, launchpad: false, spotlight: false }); },
          }, h('span', { className: 'macos-cc-glyph' }, '◐')),
          h('span', { className: 'macos-date hide-sm', 'data-macos-chrome': '1' },
            (now.getMonth() + 1) + '月' + now.getDate() + '日 周' + ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]),
          h('span', { className: 'macos-clock', 'data-macos-chrome': '1' }, pad2(now.getHours()) + ':' + pad2(now.getMinutes()))),
        h('div', { ref: menuRef },
          open === 'apple' ? h('div', { className: 'macos-menu anchor-left', onPointerDown: (e) => e.stopPropagation() },
            h(MenuRow, { label: '关于本机', onClick: () => { setOpen(null); setState({ modal: 'about' }); } }),
            h('div', { className: 'macos-menu-sep' }),
            h(MenuRow, { label: '关闭全部窗口', onClick: () => { setOpen(null); Object.keys(S.windows).forEach((id) => closeApp(id)); } }),
            h(MenuRow, { label: '打开对话窗口', hint: '⌘1', onClick: () => { setOpen(null); openApp('chat'); } }),
            h(MenuRow, { label: '打开浏览器窗口', hint: '⌘2', onClick: () => { setOpen(null); openApp('browser'); } }),
            h('div', { className: 'macos-menu-sep' }),
            h(MenuRow, { label: '退出桌面模式', hint: '⌘⌥Q', onClick: () => { setOpen(null); quitDesktop(); } })) : null,
          open === 'ego' ? h('div', { className: 'macos-menu', style: { right: '150px' }, onPointerDown: (e) => e.stopPropagation() },
            h('div', { className: 'macos-menu-row' }, h('span', null, 'ego-lite 连接')),
            h('span', { className: 'macos-menu-hint' }, s.egoStatus === 'ready' ? '已连接 · Live' : '等待浏览器视图'),
            h('div', { className: 'macos-menu-sep' }),
            h('div', { className: 'macos-menu-row' }, h('span', null, '窗口宽度')),
            h('span', { className: 'macos-menu-hint' }, String(Math.round(vp().w)) + ' × ' + String(Math.round(vp().h))),
            h('div', { className: 'macos-menu-sep' }),
            h(MenuRow, { label: '在浏览器中打开正式网页', hint: '↗', onClick: () => { setOpen(null); window.open('https://example.com', '_blank', 'noopener'); } }),
            h(MenuRow, { label: '关闭桌面浏览器窗口', hint: '⌘2', onClick: () => { setOpen(null); closeApp('browser'); } })) : null,
          open === '关于' ? h('div', { className: 'macos-menu anchor-left', style: { left: '42px' }, onPointerDown: (e) => e.stopPropagation() },
            h(MenuRow, { label: '关于 ' + (names[appId] || 'Finder'), onClick: () => { setOpen(null); setState({ modal: 'about' }); } }),
            h('div', { className: 'macos-menu-sep' }),
            h(MenuRow, { label: '服务', hint: '⌥' }),
            h(MenuRow, { label: '隐藏', hint: '⌘H' }),
            h('div', { className: 'macos-menu-sep' }),
            h(MenuRow, { label: '退出桌面模式', hint: '⌘⌥Q', onClick: () => { setOpen(null); quitDesktop(); } })) : null,
          open === 'ego' ? h('div', { className: 'macos-menu', style: { right: '10px', top: 'calc(var(--mac-menubar-h) - 1px)' }, onPointerDown: (e) => e.stopPropagation() },
            h(MenuRow, { label: s.egoStatus === 'ready' ? 'ego-lite · 已连接' : 'ego-lite · 等待中', hint: '⌘2' }),
            h(MenuRow, { label: '打开浏览器窗口', onClick: () => { setOpen(null); openApp('browser'); } }),
            h(MenuRow, { label: '打开对话窗口', onClick: () => { setOpen(null); openApp('chat'); } }),
            h('div', { className: 'macos-menu-sep' }),
            h(MenuRow, { label: '退出桌面模式', render: null, onClick: () => { setOpen(null); quitDesktop(); } })) : null,
          rows ? h('div', {
            className: 'macos-menu anchor-left',
            style: { left: (open === '文件' ? 104 : 150) + 'px' },
            onPointerDown: (e) => e.stopPropagation(),
          }, rows.map((r, i) => h(MenuRow, { key: i, label: r[0], hint: r[1] }))) : null));
    }

    function appRegistry() {
      return DESKTOP_APPS.concat(customApps());
    }

    function DockItems(props) {
      // Subscribe: without it a dock rendered inside the desktop tree (not in the strip) would keep
      // stale S when it fires an action, and the click would toggle the window it opened.
      const s = useS();
      const [hover, setHover] = useState(-1);
      const items = orderedApps().concat([{ id: 'sep' }, { id: 'trash', label: '废纸篓', icon: 'trash' }]);
      const act = (id) => {
        const win = s.windows[id];
        if (win && S.focused === id && !S.minimized[id]) minimizeApp(id);
        else openApp(id);
      };
      return items.map((it, i) => {
        if (it.id === 'sep') return h('div', { key: 'sep', className: 'macos-dock-sep' });
        const running = !!s.windows[it.id];
        const cls = 'macos-dock-item' + (hover === i ? ' hover' : (hover === i - 1 || hover === i + 1) ? ' hover-adj' : '');
        return h('div', {
          key: it.id,
          className: cls,
          onMouseEnter: () => setHover(i),
          onMouseLeave: () => setHover(-1),
          onPointerDown: (e) => { e.stopPropagation(); act(it.id); },
          onContextMenu: (e) => { e.preventDefault(); if (it.custom) removeFromApp(it.id); },
          title: it.label + (it.custom ? '（右键移除）' : ''),
          'data-macos-app': it.id,
          'data-macos-chrome': props.strip ? '1' : undefined,
        },
          hover === i ? h('div', { className: 'macos-dock-tip' }, it.label) : null,
          h('div', { className: 'dock-icon app-icon' }, h(AppIcon, { name: it.icon })),
          h('div', { className: 'macos-dock-running' + (running ? ' on' : '') }));
      });
    }

    // An app the user pinned from the desktop: either a plugin's right-bar tab (kind) or a URL page
    // opened in the shared browser window.
    function customApps() {
      try { return JSON.parse(window.localStorage.getItem('macos-desktop:apps') || '[]'); } catch (e) { return []; }
    }
    function saveCustomApps(list) {
      try { window.localStorage.setItem('macos-desktop:apps', JSON.stringify(list)); } catch (e) { /* private mode */ }
      setState({});
    }
    function userPin(entry) {
      const list = customApps().filter((a) => a.id !== entry.id);
      list.push(entry);
      saveCustomApps(list);
    }
    function removeFromApp(id) {
      saveCustomApps(customApps().filter((a) => a.id !== id));
      closeApp(id);
    }

    function Dock(props) {
      const dark = useDark();
      return h('div', { className: 'macos-dock-layer' },
        h('div', {
          className: 'macos-dock',
          onPointerDown: (e) => e.stopPropagation(),
          'data-macos-chrome': props && props.strip ? '1' : undefined,
          style: props && props.strip ? { background: dark ? 'rgba(60,60,66,0.5)' : 'rgba(255,255,255,0.46)', transform: 'scale(0.62)', transformOrigin: '50% 100%', opacity: 0.94 } : undefined,
        }, h(DockItems, { strip: !!(props && props.strip) })));
    }

    /* ============================================================== */
    /* apps                                                           */
    /* ============================================================== */

    // Bring ego's pane into this window by moving its DOM node out of the (floated, unclickable)
    // native panel. Nothing of ego's own registration is touched: the panel stays the only owner of
    // the view, the screen frame keeps streaming into it wherever it lives.
    // Panes other than ego's (chat) are moved into their window as inert boxes: a second copy of a
    // plugin's React tree would be a second live copy of its state.
    function relocateInert(source, parent) {
      if (!source || !parent) return;
      if (source.parentElement !== parent) parent.appendChild(source);
    }

    function findEgoTab() {
      const panel = panelForSurface() || document.querySelector('[data-sidebar-right-panel]');
      if (!panel) return null;
      const slot = panel.querySelector('[data-slot="sidebar.right.pane.tab"]');
      if (!slot) return null;
      const view = slot.querySelector('[class*="ego-side-root"]');
      const live = slot.querySelector('[class*="ego-side-liveimg"]');
      return live ? { slot, view } : null;
    }

    // ---- floating assistant ("精灵球") --------------------------------------------------------
    // Every app window keeps one small orb. Closed, the app is just software: mouse and keyboard
    // only. Open, it asks the agent about what the user is looking at without leaving the window.
    function makeStore(initial) {
      const state = { ...initial };
      const subs = new Set();
      let view = { ...initial };
      return {
        get: () => view,
        setState(patch) { Object.assign(state, typeof patch === 'function' ? patch(view) : patch); view = { ...state }; subs.forEach((fn) => { try { fn(); } catch (e) { /* ignore */ } }); },
        subscribe(fn) { subs.add(fn); return () => { subs.delete(fn); }; },
      };
    }
    const ASSIST = makeStore({ open: false, app: null, history: [], busy: false });
    const useAssist = () => useSyncExternalStore(ASSIST.subscribe, ASSIST.get, ASSIST.get);
    const askAssist = (app, text) => {
      const entry = { id: 'a' + Date.now(), app, text, reply: '', at: Date.now() };
      ASSIST.setState((prev) => ({ open: true, app, busy: true, history: [...prev.history.slice(-19), entry] }));
      const body = { app, prompt: text };
      fetch('/api/macos-desktop/assist', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) })
        .then((r) => r.text().then((t) => ({ ok: r.ok, t })))
        .then(({ ok, t }) => {
          let reply = t;
          try { const j = JSON.parse(t); reply = j.reply || j.text || (j.ok === false ? ('没有取到回答：' + (j.error || t.slice(0, 120))) : t); } catch { /* plain text */ }
          if (!ok) reply = '请求失败（' + reply.slice(0, 120) + '）';
          ASSIST.setState((prev) => ({
            busy: false,
            history: prev.history.map((h) => (h.id === entry.id ? { ...h, reply } : h)),
          }));
        })
        .catch((err) => ASSIST.setState((prev) => ({
          busy: false,
          history: prev.history.map((h) => (h.id === entry.id ? { ...h, reply: '无法连接：' + (err && err.message) } : h)),
        })));
    };

    function AssistOrb(props) {
      const st = useAssist();
      const [draft, setDraft] = useState('');
      const [open, setOpen] = useState(false);
      const app = props.app;
      const mine = st.history.filter((h) => h.app === app);
      const send = () => {
        const text = draft.trim();
        if (!text || st.busy) return;
        setDraft('');
        askAssist(app, text);
      };
      return h('div', { className: 'macos-orb-wrap' },
        open ? h('div', { className: 'macos-orb-panel' },
          h('div', { className: 'macos-orb-head' }, h('span', { className: 'macos-orb-title' }, '问一问这台 Mac'), h('button', { className: 'macos-orb-close', onPointerDown: () => setOpen(false) }, '×')),
          h('div', { className: 'macos-orb-log' },
            mine.length === 0 ? h('div', { className: 'macos-orb-hint' }, '描述你想做的事，我会在这个软件里替你操作。') : null,
            mine.map((h2) => h('div', { key: h2.id, className: 'macos-orb-msg' },
              h('div', { className: 'macos-orb-you' }, h2.text),
              h('div', { className: 'macos-orb-reply' }, h2.reply || (st.busy ? '…' : ''))))),
          h('div', { className: 'macos-orb-input' },
            h('textarea', {
              value: draft,
              rows: 2,
              placeholder: '例如：把这一页的标题填进表格第一行',
              onChange: (e) => setDraft(e.target.value),
              onKeyDown: (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } },
            }),
            h('button', { className: 'macos-orb-send', disabled: st.busy, onPointerDown: send }, st.busy ? '…' : '发送')))
          : null,
        h('button', {
          className: 'macos-orb' + (open ? ' on' : ''),
          title: open ? '收起对话' : '问一问这台 Mac',
          onPointerDown: () => setOpen((v) => !v),
        }, h('span', { className: 'macos-orb-dot' })));
    }


    // 访达: the workspace as a real file browser — sidebar, toolbar, breadcrumb, icon/list views,
    // a preview pane, and double-click that opens folders and files.
    const FINDER_PLACES = [
      { label: '工作区', dir: '', icon: 'folder' },
      { label: 'agentic-os', dir: 'agentic-os', icon: 'folder' },
      { label: '下载', dir: 'downloads', icon: 'folder' },
      { label: '文档', dir: 'docs', icon: 'folder' },
    ];

    function finderSize(n) {
      if (!n && n !== 0) return '—';
      if (n < 1024) return n + ' 字节';
      if (n < 1024 * 1024) return (n / 1024).toFixed(1).replace('.0', '') + ' KB';
      return (n / 1024 / 1024).toFixed(1).replace('.0', '') + ' MB';
    }

    function finderDate(ms) {
      if (!ms) return '—';
      const d = new Date(ms);
      const pad = (v) => (v < 10 ? '0' + v : String(v));
      return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function FinderApp() {
      const [items, setItems] = useState([]);
      const [dir, setDir] = useState('');
      const [view, setView] = useState('grid');
      const [query, setQuery] = useState('');
      const [selected, setSelected] = useState(null);
      const [preview, setPreview] = useState(null);
      const [note, setNote] = useState('');
      const [trail, setTrail] = useState([{ dir: '', label: '工作区' }]);
      const [trailAt, setTrailAt] = useState(0);

      useEffect(() => {
        let alive = true;
        const load = async () => {
          try {
            const r = await fetch('/api/macos-desktop/files' + (dir ? '?dir=' + encodeURIComponent(dir) : ''), { cache: 'no-store', credentials: 'same-origin' });
            const data = r.ok ? await r.json() : null;
            if (!alive) return;
            if (data && data.ok) setItems(data.items || []);
            else setNote((data && data.error) || '打不开这个文件夹');
          } catch (e) { if (alive) setNote('读取失败'); }
        };
        load();
        const timer = window.setInterval(load, 5000);
        return () => { alive = false; window.clearInterval(timer); };
      }, [dir]);

      const go = (next) => {
        setDir(next);
        setSelected(null);
        setPreview(null);
        setNote('');
        const cut = trail.slice(0, trailAt + 1);
        const label = next ? (next.split('/').filter(Boolean).pop() || '工作区') : '工作区';
        if (next === dir) return;
        setTrail(cut.concat([{ dir: next, label }]));
        setTrailAt(cut.length);
      };
      const back = () => { if (trailAt > 0) { const i = trailAt - 1; setTrailAt(i); setDir(trail[i].dir); setPreview(null); } };
      const forward = () => { if (trailAt < trail.length - 1) { const i = trailAt + 1; setTrailAt(i); setDir(trail[i].dir); setPreview(null); } };
      const up = () => {
        const parts = dir.split('/').filter(Boolean);
        parts.pop();
        go(parts.join('/'));
      };

      const open = async (it) => {
        if (it.dir) { go(it.rel || it.name); return; }
        const ext = (it.name.split('.').pop() || '').toLowerCase();
        if (ext === 'univer') { setNote('这个文件要用 Office 打开（Office 窗口还在做）'); return; }
        if (['md', 'markdown', 'txt', 'json', 'js', 'mjs', 'css', 'html', 'yml', 'yaml', 'csv', 'log', 'sh'].indexOf(ext) >= 0) {
          try {
            const r = await fetch('/api/macos-desktop/read?path=' + encodeURIComponent(it.rel || it.name), { cache: 'no-store', credentials: 'same-origin' });
            const data = r.ok ? await r.json() : null;
            if (data && data.ok) { setPreview({ name: it.name, text: data.text }); return; }
            setNote((data && data.error) || '打不开这个文件');
          } catch (e) { setNote('读取失败'); }
          return;
        }
        setNote('这个类型还不能预览');
      };

      const crumbs = [{ dir: '', label: '工作区' }].concat(
        dir.split('/').filter(Boolean).map((seg, i, all) => ({ dir: all.slice(0, i + 1).join('/'), label: seg })));

      const shown = items.filter((it) => !query || it.name.toLowerCase().indexOf(query.toLowerCase()) >= 0);

      return h(WindowFrame, {
        appId: 'finder', label: '访达', title: crumbs[crumbs.length - 1].label, orb: true,
        tool: h('div', { className: 'macos-finder-actions' },
          h('div', { className: 'macos-finder-seg' },
            h('button', { type: 'button', className: 'macos-finder-seg-btn' + (view === 'grid' ? ' on' : ''), title: '图标视图', onClick: () => setView('grid') },
              h('svg', { viewBox: '0 0 16 16', className: 'macos-finder-glyph' },
                [[2.5, 2.5], [9.5, 2.5], [2.5, 9.5], [9.5, 9.5]].map(([x, y], i) => h('rect', { key: i, x, y, width: '4', height: '4', rx: '1', fill: 'currentColor' })))),
            h('button', { type: 'button', className: 'macos-finder-seg-btn' + (view === 'list' ? ' on' : ''), title: '列表视图', onClick: () => setView('list') },
              h('svg', { viewBox: '0 0 16 16', className: 'macos-finder-glyph' },
                [3, 8, 13].map((y, i) => h('rect', { key: i, x: '2', y: String(y - 1), width: '12', height: '2', rx: '1', fill: 'currentColor' }))))),
          h('div', { className: 'macos-finder-searchwrap' },
            h('svg', { viewBox: '0 0 16 16', className: 'macos-finder-searchic' },
              h('circle', { cx: '7', cy: '7', r: '4.2', fill: 'none', stroke: 'currentColor', strokeWidth: '1.4' }),
              h('path', { d: 'M10.2 10.2 13.5 13.5', stroke: 'currentColor', strokeWidth: '1.4', strokeLinecap: 'round' })),
            h('input', {
              className: 'macos-finder-search', value: query, placeholder: '搜索',
              onChange: (e) => setQuery(e.target.value), spellCheck: false, 'aria-label': '搜索',
            }))),
        head: h('div', { className: 'macos-finder-nav' },
          h('button', { type: 'button', className: 'macos-finder-tool', disabled: trailAt === 0, onClick: back, title: '后退', 'aria-label': '后退' },
            h('svg', { viewBox: '0 0 16 16', className: 'macos-finder-glyph' }, h('path', { d: 'M10 3.5 5.5 8 10 12.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round' }))),
          h('button', { type: 'button', className: 'macos-finder-tool', disabled: trailAt >= trail.length - 1, onClick: forward, title: '前进', 'aria-label': '前进' },
            h('svg', { viewBox: '0 0 16 16', className: 'macos-finder-glyph' }, h('path', { d: 'M6 3.5 10.5 8 6 12.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round' })))),
      },
        h('div', { className: 'macos-finder' },
          h('div', { className: 'macos-finder-side' },
            h('div', { className: 'macos-finder-side-title' }, '个人收藏'),
            FINDER_PLACES.map((p) => h('button', {
              key: p.label, type: 'button',
              className: 'macos-finder-side-row' + (dir === p.dir ? ' on' : ''),
              onClick: () => go(p.dir),
            }, h('span', { className: 'macos-finder-side-ic' }, h(FolderIcon)), p.label))),
          h('div', { className: 'macos-finder-main' },
            h('div', { className: 'macos-finder-crumbbar' },
              crumbs.map((c, i) => h('span', { key: c.dir + i, className: 'macos-finder-crumb' },
                i > 0 ? h('span', { className: 'macos-finder-sep' }, '›') : null,
                h('button', { type: 'button', className: 'macos-finder-crumb-btn', onClick: () => go(c.dir) }, c.label)))),
            note ? h('div', { className: 'macos-finder-note' }, note) : null,
            h('div', { className: 'macos-finder-body' },
              view === 'grid'
                ? h('div', { className: 'macos-finder-grid' },
                  shown.map((it) => h('button', {
                    key: it.path, type: 'button',
                    className: 'macos-finder-item' + (selected === it.path ? ' on' : ''),
                    onClick: () => setSelected(it.path),
                    onDoubleClick: () => open(it),
                  },
                    h('span', { className: 'macos-finder-ic' }, it.dir
                      ? h('span', { className: 'macos-finder-folder' }, h(FolderIcon))
                      : h('span', { className: 'macos-finder-ext' }, (it.name.split('.').pop() || '•').slice(0, 4).toUpperCase())),
                    h('span', { className: 'macos-finder-name' }, it.name))))
                : h('div', { className: 'macos-finder-list' },
                  h('div', { className: 'macos-finder-row head' },
                    h('span', null, '名称'), h('span', null, '大小'), h('span', null, '修改日期')),
                  shown.map((it) => h('button', {
                    key: it.path, type: 'button',
                    className: 'macos-finder-row' + (selected === it.path ? ' on' : ''),
                    onClick: () => setSelected(it.path),
                    onDoubleClick: () => open(it),
                  },
                    h('span', { className: 'macos-finder-row-name' },
                      h('span', { className: 'macos-finder-row-ic' }, it.dir
                        ? h('span', { className: 'macos-finder-folder sm' }, h(FolderIcon))
                        : h('span', { className: 'macos-finder-ext sm' }, (it.name.split('.').pop() || '•').slice(0, 4).toUpperCase())),
                      it.name),
                    h('span', null, it.dir ? '—' : finderSize(it.size)),
                    h('span', null, finderDate(it.mtime))))),
              preview ? h('div', { className: 'macos-finder-preview' },
                h('div', { className: 'macos-finder-preview-head' },
                  h('span', null, preview.name),
                  h('button', { type: 'button', className: 'macos-btn sm', onClick: () => setPreview(null) }, '关闭')),
                h('pre', { className: 'macos-finder-preview-body' }, preview.text)) : null),
            // macOS puts one centred line here: "N 项" and, when something is picked,
            // "N 项，已选择 1 项" — no path, that belongs to the path bar.
            h('div', { className: 'macos-finder-status' },
              h('span', null, shown.length + ' 项' + (selected ? '，已选择 1 项' : ''))))));
    }

    function TrashApp() {
      return h(WindowFrame, { appId: 'trash', label: '废纸篓', orb: true },
        h('div', { className: 'macos-trash-body' },
          h('div', { className: 'macos-icon-img' }, h(TrashIcon)),
          h('div', null, '废纸篓是空的')));
    }

    // Chat: the native conversation lives in the GUI, which is parked off-screen while the
    // desktop runs. The second React root is mounted ON that parked shell, so the conversation
    // keeps its real DOM parents (and slot closures) and simply shows up in this window.
    // The desktop hides the conversation: the user should SEE the machine being driven, not the
    // chat transcript. Remote clients (phone) keep their own chat surface.
    function ChatApp() {
      const dark = useDark();
      return h(WindowFrame, { appId: 'chat', label: 'DeepSeek', orb: true, tool: h('span', { className: 'macos-tb-btn' }, 'Agent OS') },
        h('div', { className: 'macos-chat-idle' + (dark ? ' dark' : '') },
          h('div', { className: 'macos-chat-logo' }, h(WhalesIcon)),
          h('div', { className: 'macos-chat-title' }, 'DeepSeek 正在为你操作这台 Mac'),
          h('div', { className: 'macos-chat-sub' }, '用对话告诉它要做什么；它会在桌面的软件里完成操作。'),
          h('div', { className: 'macos-chat-sub dim' }, '桌面上看到的就是它正在做的事。')));
    }

    function useViewport() {
      const [v, setV] = useState(vp);
      useEffect(() => {
        const on = () => setV(vp());
        window.addEventListener('resize', on);
        return () => window.removeEventListener('resize', on);
      }, []);
      return v;
    }

    function rectFor(appId, v) {
      const win = S.windows[appId];
      if (!win) return null;
      if (v.w < 760) return { x: 0, y: MENUBAR_H, w: v.w, h: v.h - MENUBAR_H - 62 };
      if (S.zoomed[appId]) return { x: 0, y: MENUBAR_H, w: v.w, h: v.h - MENUBAR_H };
      return { x: win.x, y: win.y, w: win.w, h: win.h };
    }

    function WindowFrame(props) {
      const { appId } = props;
      const s = useS();
      const dark = useDark();
      const v = useViewport();
      const win = S.windows[appId];
      if (!win) return null;
      const edges = !!S.zoomed[appId] || v.w < 760;
      const r = rectFor(appId, v);
      const hidden = !!S.minimized[appId];
      const focused = S.focused === appId;
      const style = { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px', zIndex: win.z + (props.hole ? 200 : 0), 'data-app': appId };
      if (hidden) style.display = 'none';
      // a pane app's frame is chrome only: the plugin panel is floated onto its body rect
      const hole = !!props.hole;
      const pass = false;

      const beginDrag = (e) => {
        if (e.button !== 0) return;
        if (e.target.closest && e.target.closest('button, .macos-lights, .macos-titlebar-right')) return;
        e.preventDefault();
        focusApp(appId);
        const base = S.windows[appId];
        if (!base) return;
        const sx = e.clientX;
        const sy = e.clientY;
        const move = (ev) => {
          const vv = vp();
          patchWin(appId, {
            x: clamp(base.x + ev.clientX - sx, -base.w + 120, vv.w - 120),
            y: clamp(base.y + ev.clientY - sy, MENUBAR_H, vv.h - 60),
          });
        };
        const up = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      };

      const beginResize = (edge) => (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const base = S.windows[appId];
        if (!base) return;
        const sx = e.clientX;
        const sy = e.clientY;
        const move = (ev) => {
          const dx = ev.clientX - sx;
          const dy = ev.clientY - sy;
          const next = { x: base.x, y: base.y, w: base.w, h: base.h };
          if (edge.indexOf('e') >= 0) next.w = base.w + dx;
          if (edge.indexOf('s') >= 0) next.h = base.h + dy;
          if (edge.indexOf('w') >= 0) { next.w = base.w - dx; next.x = base.x + dx; }
          if (edge.indexOf('n') >= 0) { next.h = base.h - dy; next.y = base.y + dy; }
          if (next.w < 340) { next.x -= 340 - next.w; next.w = 340; }
          if (next.h < 220) { next.y -= 220 - next.h; next.h = 220; }
          if (next.y < MENUBAR_H) { next.h -= MENUBAR_H - next.y; next.y = MENUBAR_H; }
          patchWin(appId, next);
        };
        const up = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      };

      const cls = ['macos-window', 'app-' + appId, edges ? ' zoomed' : '', focused ? ' focused' : ' blurred', dark ? ' dark' : ''].join(' ');
      const chromeProps = pass ? { 'data-macos-pass': '1' } : {};
      return h('div', {
        className: cls,
        style,
        'data-app': appId,
        role: 'dialog',
        'aria-label': props.label,
        onPointerDownCapture: () => focusApp(appId),
      },
        pass ? null : ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'].map((edge) =>
          h('div', { key: edge, className: 'macos-resize', 'data-edge': edge, onPointerDown: beginResize(edge) })),
        h('div', { className: 'macos-titlebar macos-win-chrome' + (pass ? ' macos-win-copy' : ''), onPointerDown: beginDrag, ...chromeProps },
          h('div', { className: 'macos-lights' + (focused ? ' on' : ''), 'data-macos-chrome': '1' },
            h('button', { type: 'button', className: 'macos-light close', 'aria-label': '关闭', onClick: () => closeApp(appId) },
              h('svg', { viewBox: '0 0 12 12', className: 'macos-light-glyph' }, h('path', { d: 'M3.6 3.6l4.8 4.8M8.4 3.6l-4.8 4.8', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }))),
            h('button', { type: 'button', className: 'macos-light min', 'aria-label': '最小化', onClick: () => minimizeApp(appId) },
              h('svg', { viewBox: '0 0 12 12', className: 'macos-light-glyph' }, h('path', { d: 'M3 6h6', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }))),
            h('button', { type: 'button', className: 'macos-light zoom', 'aria-label': '缩放', onClick: () => toggleZoom(appId) },
              h('svg', { viewBox: '0 0 12 12', className: 'macos-light-glyph' }, h('path', { d: 'M3.2 4.4h4.4v4.4', fill: 'none', stroke: 'currentColor', strokeWidth: '1.4', strokeLinecap: 'round', strokeLinejoin: 'round' })))),
          h('div', { className: 'macos-title' }, props.title || props.label),
          props.head ? h('div', { className: 'macos-titlebar-head', 'data-macos-chrome': '1' }, props.head) : null,
          h('div', { className: 'macos-titlebar-right', 'data-macos-chrome': '1' }, props.tool)),
        h('div',
          {
            className: 'macos-window-body' + (pass ? ' macos-win-copy' : '') + (props.appId === 'browser' ? ' ego' : '') + (hole ? ' hole' : ''),
            'data-macos-floatbody': hole ? appId : undefined,
            'data-macos-panehost': props.paneHost || undefined,
            'data-macos-pane-inset': props.paneInset || undefined,
          },
          props.children),
        props.orb ? h(AssistOrb, { app: appId }) : null,
        pass ? ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'].map((edge) =>
          h('div', { key: 'r-' + edge, className: 'macos-resize macos-win-chrome', 'data-macos-pass': '1', 'data-edge': edge, onPointerDown: beginResize(edge) })) : null);
    }

    // A window that hosts one plugin: the child page loads the SPA again with ?dsh-macos-pane=<id>,
    // and that instance renders nothing but the plugin's own UI. The plugin keeps working exactly as
    // it does natively (Monaco, Univer, ego…), and nothing is reparented across React trees.
    // A plugin's own right-bar panel is the app: the window is chrome around it and the panel is
    // floated onto this window's body rect (see syncPanelGeometry), so Monaco / Univer / ego run
    // for real instead of inside a nested document.
    // The desktop browser: ONE ego-lite instance, the same one the user is looking at. The window
    // never mirrors a page back into the page that hosts it (that recurses), it drives and observes
    // the user's own browser through the ego routes the shell already exposes.
    function useEgoSnapshot(intervalMs) {
      const [snap, setSnap] = useState({ tabs: [], capture: null, error: null, ready: false });
      useEffect(() => {
        let alive = true;
        const tick = async () => {
          try {
            const r = await fetch('/api/ego/spaces', { cache: 'no-store', credentials: 'same-origin' });
            const text = await r.text();
            let data = null;
            try { data = JSON.parse(text); } catch { data = null; }
            if (!data) {
              // keep the reason visible instead of looking like "there are no tabs"
              if (alive) setSnap((prev) => ({ ...prev, ready: true, error: 'spaces ' + r.status + ': ' + text.slice(0, 120) }));
              return;
            }
            if (!alive) return;
            if (!data.ok) {
              setSnap((prev) => ({ ...prev, ready: true, error: 'spaces 未就绪: ' + JSON.stringify(data).slice(0, 120) }));
              return;
            }
            // the space listing keeps its tabs inline when it is small and splits them into groups
            // (`space.groups[].tabs`) once there are many - read both shapes
            const tabs = [];
            const add = (tab, space) => {
              if (!tab || !tab.targetId) return;
              if (tabs.some((t) => t.targetId === tab.targetId)) return;
              tabs.push({
                targetId: tab.targetId,
                title: tab.title || tab.url || '新标签页',
                url: tab.url || '',
                active: !!tab.active,
                viewportW: (space && space.viewportW) || tab.viewportW,
                viewportH: (space && space.viewportH) || tab.viewportH,
                group: space && space.name,
              });
            };
            // `spaces` is either a list of spaces (each carrying `tabs`) or a flat list of tabs
            for (const space of data.spaces || []) {
              if (space && space.targetId) { add(space, null); continue; }
              for (const tab of (space && space.tabs) || []) add(tab, space);
              for (const group of (space && space.groups) || []) {
                for (const tab of group.tabs || []) add(tab, { name: group.name });
              }
            }
            setSnap({ tabs, capture: data.capture || null, error: null, ready: true });
          } catch (e) {
            if (alive) setSnap((prev) => ({ ...prev, error: String(e), ready: true }));
          }
        };
        tick();
        const timer = window.setInterval(tick, intervalMs || 2500);
        return () => { alive = false; window.clearInterval(timer); };
      }, [intervalMs]);
      return snap;
    }

    // ---- browser window ---------------------------------------------------------------------
    // A real browser: the tabs of the running ego instance, a working address bar, back/forward/
    // reload, and input forwarded into the page. Navigation and target control go through the
    // plugin's small CDP bridge (/api/macos-desktop/ego); the picture comes from ego's own frame
    // relay so the window shows exactly what the browser shows.
    async function egoBridge(op, payload) {
      try {
        const r = await fetch('/api/macos-desktop/ego', {
          method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ op: op, ...(payload || {}) }),
        });
        const t = await r.text();
        try { return JSON.parse(t); } catch { return { ok: false, error: t || ('HTTP ' + r.status) }; }
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    }

    function niceUrl(url) {
      const raw = String(url || '');
      if (!raw) return '';
      return raw.replace(/^https?:\/\//, '').replace(/\/$/, '');
    }

    function BrowserApp() {
      // This window drives its OWN chromium (host `/api/macos-desktop/window`): no tab of the shape
      // "127.0.0.1:3080" ever appears in it, so nothing about the desktop leaks into what the user
      // sees, and the agent's own tabs stay untouched.
      const winBridge = (op, payload) => fetch('/api/macos-desktop/window', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ op, ...(payload || {}) }),
      }).then((r) => (r.ok ? r.json() : null)).catch(() => null);

      const [tabs, setTabs] = useState([]);
      const [currentId, setCurrentId] = useState(null);
      const [draft, setDraft] = useState('');
      const [editing, setEditing] = useState(false);
      const [frame, setFrame] = useState(null);
      const [size, setSize] = useState({ vw: 0, vh: 0 });
      const [busy, setBusy] = useState('');
      const [notice, setNotice] = useState('');
      const [booted, setBooted] = useState(false);
      const focusRef = useRef(false);

      const loadTabs = async () => {
        const out = await winBridge('tabs');
        if (out && out.ok && Array.isArray(out.tabs)) {
          const list = out.tabs.filter((t) => t.url !== 'about:blank' || out.tabs.length === 1);
          setTabs(list.length ? list : out.tabs);
          if (!currentId && out.tabs.length) {
            const first = out.tabs.find((t) => t.active) || out.tabs[0];
            setCurrentId(first.targetId);
          }
        } else if (out && out.error) {
          setNotice(out.error);
        }
      };

      // first run inside a window: bring the browser up and reuse whatever tab it already has.
      // Creating a tab on every mount is what littered about:blank tabs all over the place.
      const bootedRef = useRef(false);
      useEffect(() => {
        if (bootedRef.current) return undefined;
        bootedRef.current = true;
        let alive = true;
        (async () => {
          setBusy('正在启动浏览器…');
          await winBridge('status');
          const state = await winBridge('tabs');
          const list = (state && state.ok && state.tabs) || [];
          let target = list.find((t) => t.url && t.url !== 'about:blank') || list[0] || null;
          if (!alive) return;
          if (!target) {
            const made = await winBridge('new', { url: startPage() });
            if (made && made.targetId) target = { targetId: made.targetId };
          } else if (!target.url || target.url === 'about:blank') {
            await winBridge('navigate', { targetId: target.targetId, url: startPage() });
          }
          if (!alive) return;
          if (target) setCurrentId(target.targetId);
          await loadTabs();
          setBusy('');
          setBooted(true);
        })();
        return () => { alive = false; };
      }, []);

      useEffect(() => {
        if (!booted) return undefined;
        const timer = window.setInterval(loadTabs, 2500);
        return () => window.clearInterval(timer);
      }, [booted]);

      const current = tabs.find((t) => t.targetId === currentId) || tabs[0] || null;

      useEffect(() => {
        if (current && !editing) setDraft(current.url || '');
      }, [current && current.targetId, current && current.url, editing]);

      // the picture: one still per tick of THIS tab, independent of the browser's own focus
      useEffect(() => {
        if (!current) { setFrame(null); return undefined; }
        let alive = true;
        let timer = null;
        const tick = async () => {
          if (!alive) return;
          if (focusRef.current) {
            const out = await winBridge('frame', { targetId: current.targetId });
            if (alive && out && out.ok && out.data) {
              setFrame('data:image/jpeg;base64,' + out.data);
              setSize({ vw: out.vw || 0, vh: out.vh || 0 });
              // self-heal: if the page viewport and the window box disagree (another window resized
              // the browser, a page forced a size), push the box again instead of letterboxing
              const node = viewBox.current;
              if (node && out.vw && out.vh) {
                const rect = node.getBoundingClientRect();
                if (Math.abs(Math.round(rect.width) - out.vw) > 4 || Math.abs(Math.round(rect.height) - out.vh) > 4) {
                  winBridge('resize', { targetId: current.targetId, width: Math.round(rect.width), height: Math.round(rect.height) });
                }
              }
            } else if (alive && out && out.error) {
              setNotice(out.error);
            }
          }
          if (alive) timer = window.setTimeout(tick, 280);
        };
        focusRef.current = true;
        tick();
        return () => { alive = false; if (timer) window.clearTimeout(timer); };
      }, [current && current.targetId]);

      // keep the page's viewport equal to the window's content box, so the capture fills it exactly
      const viewBox = useRef(null);
      useEffect(() => {
        if (!current) return undefined;
        const node = viewBox.current;
        if (!node) return undefined;
        let timer = null;
        let last = '';
        const push = () => {
          // the hole can be measured before layout settles (or scaled by the shell); the frame image
          // always sits exactly on the hole, so its rendered box is the truthful content size
          const frameEl = document.querySelector('.macos-browser-hole > .macos-browser-frame');
          const box = (frameEl || node).getBoundingClientRect();
          const rect = box.width > 0 && box.height > 0 ? box : node.getBoundingClientRect();
          const width = Math.round(rect.width);
          const height = Math.round(rect.height);
          if (width < 120 || height < 120) return;
          const key = width + 'x' + height;
          if (key === last) return;
          last = key;
          winBridge('resize', { targetId: current.targetId, width, height });
        };
        const observer = new ResizeObserver(() => {
          if (timer) window.clearTimeout(timer);
          timer = window.setTimeout(push, 320);
        });
        observer.observe(node);
        const first = window.setTimeout(push, 200);
        return () => {
          observer.disconnect();
          window.clearTimeout(first);
          if (timer) window.clearTimeout(timer);
        };
      }, [current && current.targetId]);

      const withBusy = (label, run) => async (...args) => {
        setBusy(label);
        try { await run(...args); } finally { setBusy(''); }
      };

      const go = withBusy('载入中', async (url) => {
        if (!current) return;
        setNotice('');
        await winBridge('navigate', { targetId: current.targetId, url });
        setEditing(false);
        await new Promise((done) => setTimeout(done, 900));
        await loadTabs();
      });

      const openTab = withBusy('新建标签页', async () => {
        const made = await winBridge('new', { url: startPage() });
        if (made && made.targetId) setCurrentId(made.targetId);
        await loadTabs();
      });

      const closeTab = withBusy('关闭', async (targetId) => {
        await winBridge('close', { targetId });
        if (currentId === targetId) setCurrentId(null);
        await loadTabs();
      });

      // pointer + keyboard forwarding: picture pixels -> page pixels
      const toPage = (event) => {
        const box = event.currentTarget.getBoundingClientRect();
        const vw = size.vw || box.width;
        const vh = size.vh || box.height;
        return {
          x: Math.round(((event.clientX - box.left) / box.width) * vw),
          y: Math.round(((event.clientY - box.top) / box.height) * vh),
        };
      };
      const sendInput = (payload) => {
        if (!current) return;
        winBridge('input', { targetId: current.targetId, ...payload });
      };
      const onViewDown = (event) => {
        const p = toPage(event);
        event.currentTarget.focus();
        sendInput({ type: 'mousePressed', ...p, button: 'left', clickCount: 1 });
        sendInput({ type: 'mouseReleased', ...p, button: 'left', clickCount: 1 });
      };
      const onViewWheel = (event) => {
        event.preventDefault();
        const p = toPage(event);
        sendInput({ type: 'mouseWheel', ...p, deltaX: event.deltaX, deltaY: event.deltaY });
      };
      const onViewKey = (event) => {
        const printable = event.key && event.key.length === 1 && !event.metaKey && !event.ctrlKey;
        if (printable) { event.preventDefault(); sendInput({ type: 'insertText', text: event.key }); return; }
        const keys = { Enter: ['Enter', 'Enter', 13], Backspace: ['Backspace', 'Backspace', 8], Tab: ['Tab', 'Tab', 9], Escape: ['Escape', 'Escape', 27], ArrowLeft: ['ArrowLeft', 'ArrowLeft', 37], ArrowUp: ['ArrowUp', 'ArrowUp', 38], ArrowRight: ['ArrowRight', 'ArrowRight', 39], ArrowDown: ['ArrowDown', 'ArrowDown', 40] };
        const hit = keys[event.key];
        if (!hit) return;
        event.preventDefault();
        sendInput({ type: 'keyDown', key: hit[0], code: hit[1], windowsVirtualKeyCode: hit[2] });
        sendInput({ type: 'keyUp', key: hit[0], code: hit[1], windowsVirtualKeyCode: hit[2] });
      };

      return h(WindowFrame, { appId: 'browser', label: '浏览器', orb: true,
        tool: h('div', { className: 'macos-tb-group' },
          h('span', { className: 'macos-tb-btn' }, busy || '实时')) },
        h('div', { className: 'macos-browser-app' },
          h('div', { className: 'macos-chrome-tabs' },
            tabs.map((tab) => h('div', {
              key: tab.targetId,
              className: 'macos-chrome-tab' + (current && tab.targetId === current.targetId ? ' on' : ''),
              onPointerDown: (e) => { e.stopPropagation(); setCurrentId(tab.targetId); },
              title: tab.title || tab.url,
            },
              h('span', { className: 'macos-chrome-favicon' }, (tab.title || tab.url || '?').trim().charAt(0).toUpperCase()),
              h('span', { className: 'macos-chrome-tab-title' }, tab.title || tab.url || '新标签页'),
              h('span', { className: 'macos-chrome-tab-close', onPointerDown: (e) => { e.stopPropagation(); closeTab(tab.targetId); } }, '×'))),
            h('div', { className: 'macos-chrome-newtab', onPointerDown: (e) => { e.stopPropagation(); openTab(); }, title: '新建标签页' }, '+')),
          h('div', { className: 'macos-chrome-bar' },
            h('button', { type: 'button', className: 'macos-chrome-btn', title: '后退', onPointerDown: () => current && winBridge('back', { targetId: current.targetId }) }, '‹'),
            h('button', { type: 'button', className: 'macos-chrome-btn', title: '前进', onPointerDown: () => current && winBridge('forward', { targetId: current.targetId }) }, '›'),
            h('button', { type: 'button', className: 'macos-chrome-btn', title: '重新载入', onPointerDown: async () => { if (!current) return; await winBridge('reload', { targetId: current.targetId }); } }, '⟳'),
            h('div', { className: 'macos-chrome-omnibox' },
              h('span', { className: 'macos-chrome-lock' }, '🔒'),
              h('input', {
                value: draft,
                spellCheck: false,
                onFocus: () => setEditing(true),
                onBlur: () => setEditing(false),
                onChange: (e) => setDraft(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const raw = String(draft || '').trim();
                    if (!raw) return;
                    const url = /^[a-z]+:\/\//i.test(raw) ? raw : (/^[\w-]+(\.[\w-]+)+/.test(raw) ? 'https://' + raw : 'https://www.bing.com/search?q=' + encodeURIComponent(raw));
                    go(url);
                  } else if (e.key === 'Escape') { e.preventDefault(); if (current) setDraft(current.url || ''); e.currentTarget.blur(); }
                },
              }),
              h('span', { className: 'macos-chrome-omnibox-hint' }, current ? (current.title || '') : '')),
          ),
          h('div', {
            className: 'macos-browser-hole' + (frame ? ' has-frame' : ''),
            'data-macos-viewport': '1',
            ref: viewBox,
            tabIndex: 0,
            onPointerDown: onViewDown,
            onWheel: onViewWheel,
            onKeyDown: onViewKey,
          },
            frame
              ? h('img', { className: 'macos-browser-frame', src: frame, alt: '', draggable: false })
              : h('div', { className: 'macos-app-void' }, h('div', { className: 'macos-void-inner' },
                h('div', { className: 'macos-app-icon-lg' }, h(AppIcon, { name: 'chrome' })),
                h('div', { className: 'macos-ego-wait-title' }, current ? (current.title || current.url) : '正在启动浏览器'),
                h('div', { className: 'macos-ego-wait-sub' }, notice || '第一次打开需要几秒钟'))),
          ),
          h('div', { className: 'macos-browser-status' },
            notice || ((current ? (current.url || '') : '没有打开的标签页') + (frame ? ' · 实时' : '')))));
    }

    function useOpenTab(kind, enabled) {
      useEffect(() => {
        if (!enabled || !kind) return undefined;
        let alive = true;
        const open = () => {
          const tabs = svc('sidebarRightTabs');
          const side = svc('sidebarRight');
          const def = tabs && typeof tabs.get === 'function' ? tabs.get(kind) : null;
          if (!alive || !side || !def) return false;
          try {
            if (typeof side.isExpanded === 'function' && !side.isExpanded() && typeof side.toggleExpanded === 'function') side.toggleExpanded();
            side.openTab(def.kind);
            return true;
          } catch (e) { return false; }
        };
        const timer = window.setInterval(() => { if (open()) window.clearInterval(timer); }, 400);
        open();
        return () => { alive = false; window.clearInterval(timer); };
      }, [kind, enabled]);
    }

    function PaneApp(props) {
      const app = props.app;
      const pane = (app.pane && PANES[app.pane]) || null;
      window.__macosPaneDbg = window.__macosPaneDbg || {};
      window.__macosPaneDbg[app.id] = { hasPane: !!pane, kind: pane && pane.kind, tab: !!(pane && pane.kind && svc('sidebarRightTabs') && svc('sidebarRightTabs').get(pane.kind)) };
      useEffect(() => {
        if (!pane) return undefined;
        let alive = true;
        const open = () => {
          const tabs = svc('sidebarRightTabs');
          const side = svc('sidebarRight');
          const def = tabs && typeof tabs.get === 'function' ? tabs.get(pane.kind) : null;
          if (!alive || !side || !def) return false;
          try {
            if (typeof side.isExpanded === 'function' && !side.isExpanded() && typeof side.toggleExpanded === 'function') side.toggleExpanded();
            side.openTab(def.kind);
            return true;
          } catch (e) { return false; }
        };
        const timer = window.setInterval(() => { if (open()) window.clearInterval(timer); }, 400);
        open();
        return () => { alive = false; window.clearInterval(timer); };
      }, [app.id]);

      // A plugin that only exposes a dock or an overlay (no right-bar tab) cannot be floated as a
      // panel, so it renders here the way macOS would run it: its own window UI, drawn by us.
      if (!pane) {
        const Inner = INLINE_APPS[app.id] || null;
        if (Inner) {
          return h(WindowFrame, { appId: app.id, label: app.label, orb: true,
            tool: h('span', { className: 'macos-tb-btn' }, app.label) }, h(Inner, { app }));
        }
        return h(WindowFrame, { appId: app.id, label: app.label, orb: true,
          tool: h('span', { className: 'macos-tb-btn' }, '待接入') },
          h('div', { className: 'macos-app-void' }, h('div', { className: 'macos-void-inner' },
            h('div', { className: 'macos-app-icon-lg' }, h(AppIcon, { name: app.icon })),
            h('div', { className: 'macos-ego-wait-title' }, app.label + ' 正在接入'),
            h('div', { className: 'macos-ego-wait-sub' }, '这个插件的界面不在右栏标签里，正在寻找可以放进窗口的呈现方式。'))));
      }
      return h(WindowFrame, { appId: app.id, label: app.label, hole: true, paneHost: app.id, orb: true,
        tool: h('span', { className: 'macos-tb-btn' }, pane.label) },
        h('div', { className: 'macos-pane' }));
    }

    const INLINE_APPS = {};

    // Notes: Obsidian-style markdown notes. The plugin has no right-bar tab, so the window draws its
    // own list + editor over the same workspace files the plugin indexes.
    // A tiny Markdown renderer: enough for headings, lists, quotes, bold, code and pipe tables.
    // The notes vault is plain files on disk, so the same text is what DSH edits.
    function mdToHtml(text) {
      const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const inline = (v) => esc(v)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
      const out = [];
      const lines = String(text || '').split(/\r?\n/);
      let list = null;
      const closeList = () => { if (list) { out.push('</' + list + '>'); list = null; } };
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        if (/^\s*\|/.test(line) && /\|/.test(lines[i + 1] || '')) {
          closeList();
          const cells = (row) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
          const head = cells(line);
          i += 2;
          const body = [];
          while (i < lines.length && /^\s*\|/.test(lines[i])) { body.push(cells(lines[i])); i += 1; }
          i -= 1;
          out.push('<table><thead><tr>' + head.map((c) => '<th>' + inline(c) + '</th>').join('') + '</tr></thead><tbody>' +
            body.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>');
          continue;
        }
        const h = /^(#{1,4})\s+(.*)$/.exec(line);
        if (h) { closeList(); out.push('<h' + h[1].length + '>' + inline(h[2]) + '</h' + h[1].length + '>'); continue; }
        if (/^\s*>\s?/.test(line)) { closeList(); out.push('<blockquote>' + inline(line.replace(/^\s*>\s?/, '')) + '</blockquote>'); continue; }
        const ul = /^\s*[-*]\s+(?:\[([ xX])\]\s+)?(.*)$/.exec(line);
        const ol = /^\s*\d+\.\s+(.*)$/.exec(line);
        if (ul || ol) {
          const kind = ul ? 'ul' : 'ol';
          if (list !== kind) { closeList(); out.push('<' + kind + '>'); list = kind; }
          const box = ul && ul[1] !== undefined ? '<span class="macos-md-check' + (ul[1].trim() ? ' on' : '') + '"></span>' : '';
          out.push('<li>' + box + inline((ul ? ul[2] : ol[1]) || '') + '</li>');
          continue;
        }
        if (!line.trim()) { closeList(); continue; }
        closeList();
        out.push('<p>' + inline(line) + '</p>');
      }
      closeList();
      return out.join('');
    }

    function notesTags(text) {
      const set = new Set();
      const re = /(^|\s)#([\u4e00-\u9fa5A-Za-z0-9_-]{1,16})/g;
      let m = re.exec(text || '');
      while (m) { set.add(m[2]); m = re.exec(text || ''); }
      return [...set];
    }

    function NotesApp() {
      const VAULT = '/文档';
      const [items, setItems] = useState([]);
      const [open, setOpen] = useState(null);
      const [text, setText] = useState('');
      const [dirty, setDirty] = useState(false);
      const [mode, setMode] = useState('edit');
      const [note, setNote] = useState('');
      const [q, setQ] = useState('');
      const load = async (keep) => {
        try {
          const r = await fetch('/api/macos-desktop/files?dir=' + encodeURIComponent(VAULT), { cache: 'no-store', credentials: 'same-origin' });
          const j = await r.json();
          const list = ((j && j.items) || []).filter((it) => !it.dir && /\.(md|markdown|txt)$/i.test(it.name));
          list.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
          setItems(list);
          if (!keep || !open) {
            const pick = list.find((it) => open && it.rel === open.rel) || list[0];
            if (pick) await openNote(pick);
          }
        } catch (e) { setItems([]); }
      };
      const openNote = async (it) => {
        try { setText(await readTextFile(it.rel)); } catch (e) { setText(''); }
        setOpen(it); setDirty(false); setNote('');
      };
      useEffect(() => { load(false); }, []);
      useEffect(() => {
        const onKey = (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      });
      const save = async () => {
        if (!open) return;
        const j = await writeTextFile(open.rel, text);
        setDirty(false);
        setNote(j && j.ok ? '已保存' : '保存失败：' + ((j && j.error) || '未知错误'));
        if (j && j.ok) load(true);
        window.setTimeout(() => setNote(''), 2200);
      };
      const createNote = async () => {
        const name = window.prompt('新笔记的名字', '未命名笔记');
        if (!name) return;
        const rel = VAULT + '/' + String(name).replace(/[\\/:*?"<>|]/g, '-') + '.md';
        await writeTextFile(rel, '# ' + name + '\n\n');
        await load(false);
      };
      const shown = q ? items.filter((it) => it.name.toLowerCase().indexOf(q.toLowerCase()) >= 0) : items;
      const tags = notesTags(text);
      const title = open ? open.name.replace(/\.md$/i, '') : '';
      return h(WindowFrame, {
        appId: 'notes', label: '笔记', orb: true, title: open ? title : '笔记',
        head: h('div', { className: 'macos-tb-group' },
          h('button', { className: 'macos-tb-btn', onPointerDown: createNote, title: '新建笔记' }, '＋')),
        tool: h('div', { className: 'macos-tb-group' },
          h('div', { className: 'macos-seg sm' },
            h('button', { className: 'macos-seg-btn' + (mode === 'edit' ? ' on' : ''), onClick: () => setMode('edit') }, '编辑'),
            h('button', { className: 'macos-seg-btn' + (mode === 'preview' ? ' on' : ''), onClick: () => setMode('preview') }, '预览')),
          h('input', { className: 'macos-input sm', placeholder: '搜索笔记', value: q, spellCheck: false, onChange: (e) => setQ(e.target.value) })),
      },
        h('div', { className: 'macos-notes' },
          h('div', { className: 'macos-notes-side' },
            h('div', { className: 'macos-finder-side-head' }, '笔记库'),
            h('div', { className: 'macos-notes-vault' }, h('span', { className: 'macos-notes-vault-ic' }, h(AppIcon, { name: 'notes' })), '文档'),
            h('div', { className: 'macos-finder-side-head', style: { marginTop: '14px' } }, '最近 · ' + items.length),
            shown.map((it) => h('button', {
              key: it.rel,
              className: 'macos-notes-item' + (open && open.rel === it.rel ? ' on' : ''),
              onPointerDown: () => openNote(it),
            }, h('span', { className: 'macos-notes-item-name' }, it.name.replace(/\.md$/i, '')),
               h('span', { className: 'macos-notes-item-date' }, finderDate(it.mtime))))),
          h('div', { className: 'macos-notes-main' },
            open ? h('div', { className: 'macos-notes-doc' },
              h('div', { className: 'macos-notes-doc-head' },
                h('div', { className: 'macos-notes-title' }, title),
                h('div', { className: 'macos-notes-meta' }, (dirty ? '未保存 · ' : '') + (note || finderDate(open.mtime) + ' · ' + finderSize(open.size || 0))),
                h('button', { className: 'macos-btn', disabled: !dirty, onPointerDown: save }, '保存')),
              mode === 'edit'
                ? h('textarea', {
                  className: 'macos-notes-editor', value: text, spellCheck: false,
                  onChange: (e) => { setText(e.target.value); setDirty(true); },
                })
                : h('div', { className: 'macos-notes-preview', dangerouslySetInnerHTML: undefined },
                  h('div', { className: 'macos-notes-md', dangerouslySetInnerHTML: undefined },
                    h('div', { className: 'macos-notes-md-inner', dangerouslySetInnerHTML: { __html: mdToHtml(text) } }))),
              tags.length ? h('div', { className: 'macos-notes-tags' }, tags.map((t) => h('span', { key: t, className: 'macos-notes-tag' }, '#' + t))) : null)
              : h('div', { className: 'macos-notes-empty' },
                h('div', { className: 'macos-icon-i', style: { width: '64px', height: '64px' } }, h(AppIcon, { name: 'notes' })),
                h('div', { className: 'macos-empty-title' }, '没有打开笔记'),
                h('div', { className: 'macos-empty-sub' }, '从左边选一篇，或者按 ＋ 新建；DeepSeek 也能直接写这个目录。')))));
    }

    INLINE_APPS.notes = NotesApp;

    // Office: a small but real workbench over the documents in agentic-os/office.
    // 表格 / 文档 / 演示 are ordinary files, so DSH edits the same thing the window shows.
    const OFFICE_DIR = 'agentic-os/office';

    // Office is the Univer plugin's own viewer, embedded: the host hands out a same-origin viewer
    // URL for a .univer file plus the current session, and the plugin renders it inside the window.
    function OfficeApp() {
      const [files, setFiles] = useState([]);
      const [picked, setPicked] = useState(null);
      const [url, setUrl] = useState('');
      const [err, setErr] = useState('');
      const [busy, setBusy] = useState(false);

      const open = async (path) => {
        setBusy(true); setErr(''); setUrl('');
        try {
          const sid = sessionId();
          const r = await fetch('/univer-api/state?file=' + encodeURIComponent(path) + '&sessionId=' + encodeURIComponent(sessionId()), { cache: 'no-store', credentials: 'same-origin' });
          const j = await r.json();
          if (j && j.ok) {
            // the gateway (127.0.0.1:9080) is the editable Univer app itself; /univer-viewer is the
            // read-only reviewer. The app is same-origin behind the host proxy, so it embeds.
            const base = j.gateway || '';
            const next = base
              ? base.replace(/\/$/, '') + '/?file=' + encodeURIComponent(path) + '&sessionId=' + encodeURIComponent(sessionId())
              : j.viewerUrl;
            setUrl(next); setPicked(path);
          }
          else setErr((j && (j.message || j.code)) || '无法打开这个文档');
        } catch (e) { setErr(String(e.message || e)); }
        setBusy(false);
      };

      const load = async () => {
        try {
          const r = await fetch('/api/macos-desktop/univer', { cache: 'no-store', credentials: 'same-origin' });
          const j = await r.json();
          const list = (j && j.files) || [];
          setFiles(list);
          if (!picked && list[0]) open(list[0].path);
        } catch (e) { setErr('读取文件列表失败'); }
      };
      useEffect(() => { load(); }, []);

      // the app is called Office; the open file is a detail, not the window name
      const name = 'Office';
      return h(WindowFrame, {
        appId: 'office', label: 'Office', orb: true, title: name,
        head: h('div', { className: 'macos-tb-group' },
          h('button', { className: 'macos-tb-btn', onPointerDown: () => picked && open(picked), title: '重新载入' }, '⟳')),
        tool: h('div', { className: 'macos-tb-group' },
          h('span', { className: 'macos-tb-note' }, busy ? '正在打开…' : err || (files.length ? files.length + ' 个文档' : '没有文档'))),
      },
        h('div', { className: 'macos-office-wrap' },
          h('div', { className: 'macos-office-side' },
            h('div', { className: 'macos-finder-side-head' }, 'Univer 文档'),
            files.map((f) => h('button', {
              key: f.path, className: 'macos-finder-side-row' + (picked === f.path ? ' on' : ''),
              onPointerDown: () => open(f.path), title: f.path,
            }, h('span', { className: 'macos-office-ext' }, (f.name.split('.').pop() || '').toUpperCase()), f.name))),
          h('div', { className: 'macos-office-main' },
            url
              ? h('iframe', {
                    className: 'macos-office-frame', src: url, title: 'Office',
                    // no allow-popups: the gateway cannot open its own standalone window
                  sandbox: 'allow-scripts allow-same-origin allow-forms allow-modals allow-downloads',
                })
              : h('div', { className: 'macos-app-void' }, busy ? '正在打开文档…' : err || '选择左侧的文档'))));
    }


    // 设置: appearance, dock, browser start page and a real "about this Mac" panel. Values persist in
    // localStorage and are applied live on the document element, so a reload keeps the look.
    const SETTINGS_KEY = 'macos-desktop.settings.v1';
    const DEFAULT_SETTINGS = { theme: 'auto', wallpaper: 'sonoma', dockSize: 1, startPage: '', dockOrder: [] };

    // Dock order is user data: settings carry the ids, the dock renders whatever still exists.
    function dockOrder() {
      const saved = (loadSettings().dockOrder || []).filter((id) => typeof id === 'string');
      const live = appRegistry().map((a) => a.id);
      const kept = saved.filter((id) => live.indexOf(id) >= 0);
      const rest = live.filter((id) => kept.indexOf(id) < 0);
      return kept.concat(rest);
    }
    function setDockOrder(ids) {
      const next = loadSettings();
      next.dockOrder = ids.slice();
      saveSettings(next);
      emit();
    }
    function orderedApps() {
      const byId = {};
      appRegistry().forEach((a) => { byId[a.id] = a; });
      return dockOrder().map((id) => byId[id]).filter(Boolean);
    }

    function loadSettings() {
      try {
        const raw = window.localStorage.getItem(SETTINGS_KEY);
        return Object.assign({}, DEFAULT_SETTINGS, raw ? JSON.parse(raw) : {});
      } catch (e) { return Object.assign({}, DEFAULT_SETTINGS); }
    }
    function saveSettings(next) {
      try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch (e) { /* storage off */ }
      applySettings(next);
      emit();
    }
    function applySettings(next) {
      const root = document.documentElement;
      if (!root) return;
      root.setAttribute('data-macos-theme', next.theme || 'auto');
      root.setAttribute('data-macos-wallpaper', next.wallpaper || 'sonoma');
      root.style.setProperty('--mac-dock-scale', String(next.dockSize || 1));
    }

    function SettingsApp() {
      const s = useS();
      const [sys, setSys] = useState(null);
      const [settings, setSettings] = useState(loadSettings());
      const [section, setSection] = useState('外观');
      const [showSys, setShowSys] = useState(false);
      const [dragId, setDragId] = useState(null);
      const [overId, setOverId] = useState(null);
      const moveDock = (from, to) => {
        if (!from || from === to) return;
        const ids = dockOrder();
        const a = ids.indexOf(from);
        const b = ids.indexOf(to);
        if (a < 0 || b < 0) return;
        ids.splice(a, 1);
        ids.splice(b, 0, from);
        setDockOrder(ids);
      };
      const mainRef = useRef(null);
      const jump = (label) => {
        setSection(label);
        const box = mainRef.current;
        if (!box) return;
        const heads = box.querySelectorAll('.macos-settings-section h3');
        for (let i = 0; i < heads.length; i += 1) {
          if (heads[i].textContent === label) { heads[i].scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
        }
      };
      useEffect(() => {
        let alive = true;
        fetch('/api/macos-desktop/system', { cache: 'no-store', credentials: 'same-origin' })
          .then((r) => (r.ok ? r.json() : null))
          .then((j) => { if (alive && j && j.ok) setSys(j); })
          .catch(() => undefined);
        return () => { alive = false; };
      }, []);
      const patch = (next) => { const merged = Object.assign({}, settings, next); setSettings(merged); saveSettings(merged); };

      const dark = s.dark;
      const rows = [
        { key: 'theme', label: '外观', options: [['auto', '跟随系统'], ['light', '浅色'], ['dark', '深色']], value: settings.theme },
        { key: 'wallpaper', label: '壁纸', options: [['sonoma', 'Sonoma 渐变'], ['aurora', '极光'], ['graphite', '石墨']], value: settings.wallpaper },
      ];

      return h(WindowFrame, { appId: 'settings', label: '设置', orb: true,
        tool: h('span', { className: 'macos-tb-btn' }, 'macOS') },
        h('div', { className: 'macos-settings' },
          h('div', { className: 'macos-settings-side' },
            ['外观', '桌面与程序坞', '浏览器', '关于本机', '桌面软件'].map((label) => h('button', {
              key: label, type: 'button',
              className: 'macos-settings-side-row' + (section === label ? ' on' : ''),
              onClick: () => jump(label),
            }, label))),
          h('div', { className: 'macos-settings-main', ref: mainRef },
            rows.map((row) => h('section', { key: row.key, className: 'macos-settings-section' },
              h('h3', null, row.label),
              h('div', { className: 'macos-seg' },
                row.options.map(([value, label]) => h('button', {
                  key: value, type: 'button',
                  className: 'macos-seg-btn' + (row.value === value ? ' on' : ''),
                  onClick: () => patch({ [row.key]: value }),
                }, label))))),
            h('section', { className: 'macos-settings-section' },
              h('h3', null, '桌面与程序坞'),
              h('input', {
                type: 'range', min: '0.8', max: '1.4', step: '0.05',
                value: String(settings.dockSize),
                onChange: (e) => patch({ dockSize: Number(e.target.value) }),
                className: 'macos-range',
              })),
            h('section', { className: 'macos-settings-section' },
              h('h3', null, '浏览器起始页'),
              h('input', {
                className: 'macos-input', value: settings.startPage, spellCheck: false,
                onChange: (e) => setSettings(Object.assign({}, settings, { startPage: e.target.value })),
                onBlur: (e) => patch({ startPage: e.target.value || DEFAULT_SETTINGS.startPage }),
                onKeyDown: (e) => { if (e.key === 'Enter') patch({ startPage: e.currentTarget.value || DEFAULT_SETTINGS.startPage }); },
              })),
            h('section', { className: 'macos-settings-section' },
              h('h3', null, '关于本机'),
              // The panel shows the machine this desktop pretends to be; the real host is one
              // click away under 系统报告, so the fiction never hides the truth from its owner.
              h('div', { className: 'macos-about' },
                h('div', { className: 'macos-about-mark' }, h(AppIcon, { name: 'whales' })),
                h('div', { className: 'macos-about-name' }, 'MacBook Pro'),
                h('div', { className: 'macos-about-sub' }, '14 英寸，2023 年'),
                h('dl', { className: 'macos-about-spec' },
                  [['芯片', 'Apple M3 Pro'], ['内存', '36 GB'], ['序列号', 'C02XK9L2JGH5'], ['macOS', 'Sonoma 14.5']].map((pair) => h('div', { className: 'macos-about-spec-row', key: pair[0] },
                    h('dt', null, pair[0]), h('dd', null, pair[1])))),
                h('div', { className: 'macos-about-actions' },
                  h('button', { type: 'button', className: 'macos-btn', onClick: () => setShowSys((v) => !v) }, showSys ? '隐藏系统报告' : '系统报告…')),
                showSys ? h('div', { className: 'macos-about-report' },
                  sys ? [
                    ['主机名', sys.hostname],
                    ['机型', sys.model],
                    ['平台', sys.platform + ' · ' + sys.arch + ' · ' + sys.cores + ' 核'],
                    ['内存', Math.round(sys.memoryTotal / 1073741824) + ' GB（可用 ' + (sys.memoryFree / 1073741824).toFixed(1) + ' GB）'],
                    ['负载', sys.loadavg.map((v) => v.toFixed(2)).join('  ') + ' · 已运行 ' + Math.floor(sys.uptime / 3600) + ' 小时'],
                    ['运行时', 'Node ' + sys.node + ' · 插件 PID ' + sys.pid],
                    ['工作区', sys.workspace],
                  ].map((pair) => h('div', { className: 'macos-about-report-row', key: pair[0] }, h('span', null, pair[0]), h('code', null, String(pair[1]))))
                    : h('div', { className: 'macos-settings-note' }, '正在读取系统信息…')) : null)),
            h('section', { className: 'macos-settings-section' },
              h('h3', null, '桌面软件'),
              h('div', { className: 'macos-settings-note' }, '拖动可以调整 Dock 里的顺序；每个窗口右下角的精灵球能问它「你能做什么」。'),
              // Pointer-driven reorder: HTML5 drag is fussy across the desktop's own pointer
              // handlers, and this same code path also works for touch on a phone.
              h('div', {
                className: 'macos-dock-list',
                onPointerMove: (e) => {
                  if (!dragId) return;
                  const hit = document.elementFromPoint(e.clientX, e.clientY);
                  const row = hit && hit.closest ? hit.closest('[data-macos-dock-row]') : null;
                  const id = row && row.getAttribute('data-macos-dock-row');
                  if (id && id !== dragId) moveDock(dragId, id);
                },
                onPointerUp: () => setDragId(null),
                onPointerLeave: () => { if (dragId) setDragId(null); },
              },
                orderedApps().map((app, index) => h('div', {
                  key: app.id,
                  className: 'macos-dock-row' + (dragId === app.id ? ' dragging' : ''),
                  'data-macos-dock-row': app.id,
                  onPointerDown: (e) => {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    setDragId(app.id);
                  },
                  onPointerUp: () => setDragId(null),
                },
                  h('span', { className: 'macos-dock-row-grip', 'aria-hidden': 'true' }, '⋮⋮'),
                  h('span', { className: 'macos-dock-row-icon' }, h(AppIcon, { name: app.icon })),
                  h('span', { className: 'macos-dock-row-name' }, app.label),
                  h('span', { className: 'macos-dock-row-slot' }, String(index + 1)))),
                h('button', { type: 'button', className: 'macos-btn', style: { marginTop: '10px' }, onClick: () => setDockOrder([]) }, '恢复默认顺序'))))));
    }

    // Right-bar tab types currently registered by plugins (for the Settings pin list).
    function availableTabs() {
      const tabs = svc('sidebarRightTabs');
      const known = ['ego-browser:watch'];
      appRegistry().forEach((a) => { if (a.surface && a.surface.kind) known.push(a.surface.kind); });
      let list = [];
      try {
        const entries = tabs && typeof tabs.entries === 'function' ? tabs.entries() : [];
        list = (entries || []).map((e) => (Array.isArray(e) ? e[1] : e)).filter((d) => d && d.kind && d.kind !== 'ego-browser:watch');
      } catch (e) { list = []; }
      const seen = {};
      return list.filter((d) => { if (seen[d.kind]) return false; seen[d.kind] = true; return true; });
    }

    // Terminal: a real pty through the plugin's host half (POST /api/macos-terminal/exec runs one
    // command in the workspace; a session keeps cwd and history). The agent can use it, and the user
    // types in it exactly like a terminal window.
    // Terminal: one long-lived interactive bash on the host (`/api/macos-terminal/session`).
    // Keystrokes go straight into the shell and its echo comes back — the same pipe the agent uses,
    // so both sides watch one real session instead of replaying commands.
    function TerminalApp() {
      const [out, setOut] = useState('');
      const [running, setRunning] = useState(true);
      const cursor = useRef(0);
      const screen = useRef(null);
      const post = (body) => fetch('/api/macos-terminal/session', {
        method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => r.json()).catch(() => null);

      useEffect(() => {
        let alive = true;
        post({ op: 'start' });
        const tick = async () => {
          const j = await post({ op: 'poll', since: cursor.current });
          if (!alive || !j) return;
          if (typeof j.since === 'number') cursor.current = j.since;
          if (j.out) setOut((prev) => (prev + j.out).slice(-200000));
          setRunning(!!j.running);
        };
        const timer = window.setInterval(tick, 260);
        return () => { alive = false; window.clearInterval(timer); };
      }, []);

      useEffect(() => {
        if (screen.current) screen.current.scrollTop = screen.current.scrollHeight;
      }, [out]);

      const write = (data) => { post({ op: 'write', data }); };
      const onKeyDown = (event) => {
        if (event.metaKey || event.ctrlKey) {
          if ((event.key === 'c' || event.key === 'C') && !event.shiftKey) { event.preventDefault(); post({ op: 'interrupt' }); }
          return;
        }
        const controls = {
          Enter: '\r', Backspace: '\x7f', Tab: '\t', Escape: '\x1b',
          ArrowUp: '\x1b[A', ArrowDown: '\x1b[B', ArrowRight: '\x1b[C', ArrowLeft: '\x1b[D',
          Home: '\x1b[H', End: '\x1b[F',
        };
        if (controls[event.key]) { event.preventDefault(); write(controls[event.key]); return; }
        if (event.key.length === 1) { event.preventDefault(); write(event.key); }
      };

      return h(WindowFrame, { appId: 'terminal', label: '终端', orb: true,
        tool: h('span', { className: 'macos-tb-btn' }, running ? 'bash' : '已退出') },
        h('div', { className: 'macos-term' },
          h('div', {
            className: 'macos-term-screen', ref: screen, tabIndex: 0,
            onKeyDown, onClick: (e) => e.currentTarget.focus(),
            autoFocus: true,
          }, out
            ? h('pre', { className: 'macos-term-text' }, out, h('span', { className: 'macos-term-cursor', 'aria-hidden': 'true' }))
            : h('pre', { className: 'macos-term-text' }, '正在连接 shell…')),
          h('div', { className: 'macos-term-foot' },
            running ? null : h('button', { type: 'button', className: 'macos-btn sm', onClick: () => { setOut(''); cursor.current = 0; post({ op: 'start' }); } }, '重新打开'),
            h('span', { className: 'macos-term-hint' }, '点击窗口后直接输入 · ⌃C 中断'))));
    }

    function AppWindow(props) {
      const app = APP_BY_ID[props.appId] || { id: props.appId, label: props.appId, surface: { type: 'static' } };
      const type = app.surface ? app.surface.type : 'static';
      if (type === 'desk-browser') return h(BrowserApp);
      if (type === 'bridge') return h(BrowserApp);
      if (type === 'finder') return h(FinderApp);
      if (type === 'terminal') return h(TerminalApp);
      if (type === 'notes') return h(NotesApp, { app });
      if (type === 'pane') return h(PaneApp, { app });
      if (type === 'univer') return h(OfficeApp);
      if (type === 'tab') return h(PaneApp, { app });
      if (props.appId === 'trash') return h(TrashApp);
      if (props.appId === 'settings') return h(SettingsApp);
      return h(PluginTabApp, { app });
    }

    function AboutSheet() {
      const s = useS();
      if (!s.modal) return null;
      return h('div', { className: 'macos-sheet-backdrop', onPointerDown: () => setState({ modal: null }) },
        h('div', { className: 'macos-sheet', onPointerDown: (e) => e.stopPropagation() },
          h('div', { className: 'macos-chat-logo app-icon' }, h(WhalesIcon)),
          h('div', { className: 'macos-sheet-title' }, 'Agent OS'),
          h('div', { className: 'macos-sheet-sub' }, 'DeepSeek Harness · macOS 桌面外壳'),
          h('div', { className: 'macos-sheet-meta' }, 'ego-lite: ' + (s.egoStatus === 'ready' ? '已连接' : '等待中')),
          h('div', { className: 'macos-sheet-actions' },
            h('button', { type: 'button', className: 'macos-btn', onClick: () => setState({ modal: null }) }, '好'),
            h('button', { type: 'button', className: 'macos-btn primary', onClick: () => quitDesktop() }, '回到原生界面'))));
    }

    function DesktopIcons() {
      const s = useS();
      return h('div', { className: 'macos-desktop-area', onPointerDown: () => setState({ desktopSelected: null }) },
        DESKTOP_APPS.map((it) => h('div', {
          key: it.id,
          className: 'macos-icon-cell' + (s.desktopSelected === it.id ? ' selected' : ''),
          onPointerDown: (e) => { e.stopPropagation(); setState({ desktopSelected: it.id }); },
          onDoubleClick: () => openApp(it.id),
          title: '双击打开 ' + it.label,
        },
          h('div', { className: 'macos-icon-img app-icon' }, h(AppIcon, { name: it.icon })),
          h('div', { className: 'macos-icon-label' }, it.label),
          h('div', { className: 'macos-icon-cell-dot' + (s.windows[it.id] ? ' on' : '') }))));
    }

    /* ---------- native conversation, floated over the desktop ---------- */
    // The real DSH conversation lives in the shell frame, which we park by margin (never by
    // transform) so a `position: fixed` child still resolves against the viewport. That lets us
    // show the untouched conversation — composer, streaming, tool traces — without cloning it.
    function ChatBubble() {
      const s = useS();
      return h('button', {
        className: 'macos-bubble' + (s.chat ? ' on' : ''),
        title: s.chat ? '收起对话（Esc）' : '和 agent 说话（⌘J）',
        'data-macos-chat-toggle': '',
        onPointerDown: (e) => { e.preventDefault(); e.stopPropagation(); setState({ chat: !S.chat, launchpad: false, control: false }); },
      },
        h('span', { className: 'macos-bubble-dot' }),
        h(WhalesIcon, { className: 'macos-bubble-ic' }));
    }

    /* ---------- Launchpad (F4) ---------- */
    function Launchpad() {
      const s = useS();
      const apps = orderedApps();
      const [q, setQ] = React.useState('');
      if (!s.launchpad) return null;
      const list = apps.filter((a) => !q || a.label.toLowerCase().includes(q.toLowerCase()));
      return h('div', {
        className: 'macos-launchpad',
        onPointerDown: (e) => { if (e.target === e.currentTarget) setState({ launchpad: false }); },
      },
        h('input', {
          className: 'macos-launchpad-search', placeholder: '搜索', autoFocus: true, value: q,
          onInput: (e) => setQ(e.target.value),
          onKeyDown: (e) => { if (e.key === 'Escape') setState({ launchpad: false }); },
        }),
        h('div', { className: 'macos-launchpad-grid' },
          list.map((a) => h('button', {
            key: a.id, className: 'macos-launchpad-app',
            onPointerDown: (e) => { e.preventDefault(); openApp(a.id); setState({ launchpad: false }); },
          },
            h('span', { className: 'macos-launchpad-ic' }, h(AppIcon, { name: a.icon })),
            h('span', { className: 'macos-launchpad-label' }, a.label)))));
    }

    /* ---------- Spotlight (⌘Space) ---------- */
    function Spotlight() {
      const s = useS();
      const [q, setQ] = React.useState('');
      const [hits, setHits] = React.useState([]);
      useEffect(() => {
        if (!s.spotlight) { setQ(''); setHits([]); return undefined; }
        if (!q.trim()) { setHits([]); return undefined; }
        let alive = true;
        const t = window.setTimeout(() => {
          fetch('/api/macos-desktop/files?dir=' + encodeURIComponent('/工作区'), { cache: 'no-store', credentials: 'same-origin' })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
              if (!alive || !data) return;
              const needle = q.trim().toLowerCase();
              const files = (data.items || data.entries || []).filter((e) => e.name.toLowerCase().includes(needle)).slice(0, 8)
                .map((e) => ({ kind: e.dir ? '文件夹' : '文件', label: e.name, rel: e.rel }));
              const apps = orderedApps().filter((a) => a.label.toLowerCase().includes(needle))
                .map((a) => ({ kind: '应用', label: a.label, app: a.id }));
              setHits([...apps, ...files]);
            })
            .catch(() => {});
        }, 180);
        return () => { alive = false; window.clearTimeout(t); };
      }, [q, s.spotlight]);
      if (!s.spotlight) return null;
      return h('div', { className: 'macos-spotlight-wrap', onPointerDown: (e) => { if (e.target === e.currentTarget) setState({ spotlight: false }); } },
        h('div', { className: 'macos-spotlight' },
          h('input', {
            className: 'macos-spotlight-input', placeholder: 'Spotlight 搜索', autoFocus: true, value: q,
            onInput: (e) => setQ(e.target.value),
            onKeyDown: (e) => {
              if (e.key === 'Escape') setState({ spotlight: false });
              if (e.key === 'Enter' && hits[0]) {
                if (hits[0].app) openApp(hits[0].app);
                else openApp('finder');
                setState({ spotlight: false });
              }
            },
          }),
          hits.length ? h('div', { className: 'macos-spotlight-list' },
            hits.map((hit, i) => h('button', {
              key: i, className: 'macos-spotlight-row',
              onPointerDown: (e) => { e.preventDefault(); if (hit.app) openApp(hit.app); else openApp('finder'); setState({ spotlight: false }); },
            }, h('span', { className: 'macos-spotlight-kind' }, hit.kind), h('span', { className: 'macos-spotlight-label' }, hit.label)))) : null));
    }

    /* ---------- Control Centre ---------- */
    function ControlCentre() {
      const s = useS();
      const [wifi, setWifi] = React.useState(true);
      const [bt, setBt] = React.useState(true);
      const [dnd, setDnd] = React.useState(false);
      const [bright, setBright] = React.useState(82);
      const [vol, setVol] = React.useState(46);
      useEffect(() => {
        document.documentElement.style.setProperty('--mac-brightness', String(1 - (100 - bright) / 260));
      }, [bright]);
      if (!s.control) return null;
      const tile = (label, on, set, icon) => h('button', {
        className: 'macos-cc-tile' + (on ? ' on' : ''),
        onPointerDown: (e) => { e.preventDefault(); set(!on); },
      }, h('span', { className: 'macos-cc-tile-ic' }, icon), h('span', { className: 'macos-cc-tile-label' }, label));
      return h('div', { className: 'macos-cc', onPointerDown: (e) => e.stopPropagation() },
        h('div', { className: 'macos-cc-grid' },
          tile('Wi-Fi', wifi, setWifi, h(WifiGlyph, {})),
          tile('蓝牙', bt, setBt, h('span', { className: 'macos-cc-glyph' }, '✳')),
          tile('勿扰', dnd, setDnd, h('span', { className: 'macos-cc-glyph' }, '☾'))),
        h('label', { className: 'macos-cc-row' }, h('span', {}, '亮度'),
          h('input', { type: 'range', min: 20, max: 100, value: bright, onInput: (e) => setBright(Number(e.target.value)) })),
        h('label', { className: 'macos-cc-row' }, h('span', {}, '声音'),
          h('input', { type: 'range', min: 0, max: 100, value: vol, onInput: (e) => setVol(Number(e.target.value)) })),
        h('div', { className: 'macos-cc-foot' }, (loadSettings().theme === 'dark' ? '深色' : '浅色') + ' · ' + new Date().toLocaleDateString('zh-CN')));
    }

    /* ---------- Sonoma desktop widgets ---------- */
    // Mission Control: shrink every open window into a grid so you can pick one (F3)
    function toggleMission() {
      const ids = Object.keys(S.windows || {});
      if (!ids.length) return;
      if (S.mission) {
        const saved = S.__missionSaved || {};
        const windows = Object.assign({}, S.windows);
        Object.keys(saved).forEach((id) => { if (windows[id]) windows[id] = Object.assign({}, windows[id], saved[id]); });
        setState({ windows, mission: false, __missionSaved: null });
        return;
      }
      const v = vp();
      const n = ids.length;
      const cols = Math.min(3, n);
      const rows = Math.ceil(n / cols);
      const cw = Math.floor((v.w - 80 - (cols - 1) * 24) / cols);
      const ch = Math.floor((v.h - 150 - (rows - 1) * 24) / rows);
      const windows = Object.assign({}, S.windows);
      const saved = {};
      ids.forEach((id, i) => {
        const w = windows[id];
        if (!w) return;
        saved[id] = { x: w.x, y: w.y, w: w.w, h: w.h };
        windows[id] = Object.assign({}, w, {
          x: 40 + (i % cols) * (cw + 24),
          y: 40 + Math.floor(i / cols) * (ch + 24),
          w: cw, h: ch, z: 10 + i,
        });
      });
      setState({ windows, mission: true, __missionSaved: saved });
    }

    function WidgetStack() {
      const s = useS();
      const d = s.now || new Date();
      const days = ['日', '一', '二', '三', '四', '五', '六'];
      const first = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
      const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < first; i += 1) cells.push(null);
      for (let i = 1; i <= dim; i += 1) cells.push(i);
      return h('div', { className: 'macos-widgets' },
        h('div', { className: 'macos-widget' },
          h('div', { className: 'macos-widget-time' }, pad2(d.getHours()) + ':' + pad2(d.getMinutes())),
          h('div', { className: 'macos-widget-sub' }, (d.getMonth() + 1) + '月' + d.getDate() + '日 周' + days[d.getDay()])),
        h('div', { className: 'macos-widget' },
          h('div', { className: 'macos-widget-head' }, (d.getMonth() + 1) + '月'),
          h('div', { className: 'macos-widget-cal' },
            ['日', '一', '二', '三', '四', '五', '六'].map((w) => h('span', { key: w, className: 'macos-widget-dow' }, w)),
            cells.map((n, i) => h('span', { key: i, className: 'macos-widget-day' + (n === d.getDate() ? ' today' : '') }, n || '')))));
    }

    function Desktop(props) {
      const s = useS();
      const dark = useDark();
      const mountRef = useRef(null);
      useEffect(() => {
        const onKey = (e) => {
          // ⌘Space Spotlight / F4 Launchpad / ⌘J conversation / Esc closes the top layer
          if (e.key === ' ' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setState({ spotlight: !S.spotlight, chat: false, launchpad: false, control: false });
            return;
          }
          if (e.key === 'F4') { e.preventDefault(); setState({ launchpad: !S.launchpad, spotlight: false, control: false }); return; }
          if (e.key === 'F3') { e.preventDefault(); toggleMission(); return; }
          if ((e.metaKey || e.ctrlKey) && e.altKey) {
            if (e.key === 'q' || e.key === 'Q') { e.preventDefault(); quitDesktop(); }
            return;
          }
          if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
            if (e.key === '1') { e.preventDefault(); openApp('chat'); }
            else if (e.key === '2') { e.preventDefault(); openApp('browser'); }
            else if (e.key === '0') { e.preventDefault(); quitDesktop(); }
            else if (e.key.toLowerCase() === 'j') { e.preventDefault(); setState({ chat: !S.chat, spotlight: false, launchpad: false, control: false }); }
            return;
          }
          if (e.key === 'Escape') {
            if (S.spotlight || S.launchpad || S.control || S.chat) { setState({ spotlight: false, launchpad: false, control: false, chat: false }); return; }
            if (S.modal) setState({ modal: null });
          }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, []);
      // the panel is glued to a window body by the 200ms reconcile tick (not per frame: this
      // machine is a Pi and a rAF loop here starves the page)
      useEffect(() => { syncPanelGeometry(); emit(); }, [s.windows, s.focused, s.minimized, s.zoomed]);
      // the native conversation is floated by CSS while the desktop bubble is open
      useEffect(() => {
        document.documentElement.setAttribute('data-macos-chat', s.chat ? 'on' : 'off');
        return () => document.documentElement.removeAttribute('data-macos-chat');
      }, [s.chat]);
      const open = s.order.filter((id) => s.windows[id]);
      return h('div', { className: 'macos-desktop' + (dark ? ' dark' : '') },
        h('div', { className: 'macos-wallpaper', style: { backgroundImage: 'url("' + WALLPAPER + '")' } }),
        h('div', { className: 'macos-wallpaper-tint' }),
        h(Menubar, { key: 'mb' }),
        h(WidgetStack, { key: 'widgets' }),
        h(DesktopIcons, { key: 'icons' }),
        h('div', { className: 'macos-windows', key: 'wins' },
          open.map((id) => h(AppWindow, { key: id, appId: id }))),
        h(Dock, { key: 'dock' }),
        h(ChatBubble, { key: 'bubble' }),
        h(Launchpad, { key: 'launchpad' }),
        h(Spotlight, { key: 'spotlight' }),
        h(ControlCentre, { key: 'cc' }),
        h('div', { ref: mountRef, style: { display: 'none' } }),
        h(AboutSheet, { key: 'sheet' }));
    }

    // Floating chrome above the ego panel: menubar strip, Dock strip, and the footer that keeps
    // the window shadow visible around the panel.
    function FloatingChrome() {
      return h('div', { className: 'macos-overlay-root' },
        h('div', { className: 'macos-menubar-strip' }, h(Menubar, { strip: true })),
        h(Dock, { strip: true }));
    }


    /* ============================================================== */
    /* standalone ego pane                                            */
    /* ============================================================== */

    /* ============================================================== */
    /* slot overlay seat                                              */
    /* ============================================================== */

    function Overlay(props) {
      // Child page of a software window: render that one plugin surface, nothing else.
      if (currentPane()) return h(MountPane, { pane: currentPane() });
      const s = useS();
      // The desktop needs the current session id to ask plugin hosts (Univer) for a viewer URL;
      // the overlay seat is not session-scoped, so read it from the session store.
      const sessions = props && typeof props.useSessions === 'function' ? props.useSessions((v) => v) : null;
      if (sessions) {
        const cur = sessions.currentId || sessions.activeId || sessions.selectedId || null;
        if (cur && cur !== CURRENT_SESSION) { CURRENT_SESSION = cur; }
      }
      const seatRef = useRef(null);
      useEffect(() => {
        overlaySeat = seatRef.current;
        if (overlaySeat) overlaySeat.setAttribute('data-macos-seat', '');
      }, []);
      return h('div', { className: 'macos-overlay', ref: seatRef },
        s.active
          ? (desktopRoot ? h(FloatingChrome) : h(DesktopSeat))
          : h('button', {
            type: 'button',
            className: 'macos-launch',
            title: '进入 macOS 桌面模式',
            onPointerDown: (e) => { e.stopPropagation(); setActive(true); },
          }, h('span', { className: 'macos-launch-ic' }, h(LaunchGlyph)), h('span', { className: 'macos-launch-txt' }, '桌面')));
    }

    /* ============================================================== */
    /* plugin                                                         */
    /* ============================================================== */

    if (typeof window.addEventListener === 'function') {
      window.addEventListener('error', (e) => {
        try { (window.__macosErrors = window.__macosErrors || []).push(String(e.message) + ' @ ' + (e.filename || '') + ':' + e.lineno); } catch (x) { /* debug */ }
      });
    }

    // Fast control surface for the agent: window/desktop actions without simulated waits.
    window.__macos = {
      desktop: (on) => { setActive(on !== false); return !!S.active; },
      open: (id) => { openApp(id); return !!S.windows[id]; },
      close: (id) => { closeApp(id); return !S.windows[id]; },
      focus: (id) => { focusApp(id); return S.focused === id; },
      // place a window explicitly (demo layouts): {x,y,w,h} in viewport pixels
      rect: (id, rect) => {
        if (!S.windows[id] || !rect) return false;
        patchWin(id, {
          x: Math.round(rect.x), y: Math.round(rect.y),
          w: Math.round(rect.w), h: Math.round(rect.h),
        });
        if (S.zoomed[id]) setState({ zoomed: Object.assign({}, S.zoomed, { [id]: false }) });
        return true;
      },
      minimize: (id) => { minimizeApp(id); return !!S.minimized[id]; },
      restore: (id) => { focusApp(id); return !S.minimized[id]; },
      // macOS-style layout presets: 'main-left' leaves the right column free for side apps
      layout: (preset) => {
        const m = window.__macos;
        const v = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const top = MENUBAR_H + 8;
        const usable = vh - top - 96;
        if (preset === 'stack') {
          // three layers, all clear of the desktop icon column (left ~116px):
          // finder at the bottom, note + office in the middle (wider than the browser), browser on top
          const gutter = 116;
          const rightGap = 24;
          const innerW = v - gutter - rightGap;
          m.rect('finder', { x: gutter, y: top + 8, w: Math.round(innerW * 0.88), h: Math.round(usable * 0.62) });
          const midTop = top + 52;
          const midW = Math.round(innerW * 0.96);
          const halfW = Math.round((midW - 16) / 2);
          m.rect('notes', { x: gutter, y: midTop, w: Math.round(halfW * 0.9), h: Math.round(usable * 0.56) });
          m.rect('office', { x: gutter + Math.round(halfW * 0.9) + 16, y: midTop, w: midW - Math.round(halfW * 0.9) - 16, h: Math.round(usable * 0.6) });
          // the browser keeps a normal 16:10-ish reading shape
          const bw = Math.round(v * 0.6);
          const bh = Math.min(Math.round(bw * 0.56), usable - 40);
          m.rect('browser', { x: Math.round((v - bw) / 2) + 30, y: top + 30, w: bw, h: bh });
          setState({
            windows: Object.assign({}, S.windows, {
              finder: Object.assign({}, S.windows.finder, { z: 10 }),
              notes: Object.assign({}, S.windows.notes, { z: 11 }),
              office: Object.assign({}, S.windows.office, { z: 12 }),
              browser: Object.assign({}, S.windows.browser, { z: 13 }),
            }),
            focused: 'browser',
          });
          return true;
        }
        if (preset === 'browser-min') {
          // after the searches: the browser drops to the smallest readable size in a corner
          m.rect('browser', { x: 24, y: top + 16, w: 420, h: 300 });
          return true;
        }
        if (preset === 'browser-large') {
          const bw = Math.round(v * 0.46);
          m.rect('browser', { x: Math.round((v - bw) / 2), y: top + 16, w: bw, h: Math.round(usable * 0.56) });
          return true;
        }
        if (preset === 'main-left') {
          patchWin('browser', { x: 24, y: top, w: Math.round(v * 0.56), h: Math.round(usable * 0.62) });
          patchWin('notes', { x: 24, y: top + Math.round(usable * 0.62) + 10, w: Math.round(v * 0.56), h: Math.round(usable * 0.38) - 10 });
          patchWin('office', { x: Math.round(v * 0.56) + 36, y: top + 30, w: Math.round(v * 0.42) - 60, h: usable - 30 });
          if (S.zoomed.browser || S.zoomed.notes || S.zoomed.office) setState({ zoomed: {} });
          return true;
        }
        return false;
      },
      state: () => ({ active: S.active, windows: Object.keys(S.windows), focused: S.focused }),
      waitFor: (sel, ms) => new Promise((resolve) => {
        const done = Date.now() + (ms || 8000);
        const tick = () => {
          if (document.querySelector(sel)) return resolve(true);
          if (Date.now() > done) return resolve(false);
          return window.setTimeout(tick, 120);
        };
        tick();
      }),
    };

    const CSS = "/* macOS desktop shell for the Harness Web GUI.\n\n   Layers (bottom → top):\n     1. native shell, parked off-screen while the desktop runs\n     2. .macos-desktop (React tree re-parented into a body-level host)\n     3. [data-sidebar-right-session] — ego-lite's own panel, floated under the\n        browser window's content rect\n     4. 废纸篓 window\n   The menubar and the Dock are drawn twice: once inside the desktop layer and\n   once (as thin, clickable strips) above the floated panel, because the panel\n   paints over everything inside the desktop layer. */\n\n.macos-overlay {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", \"PingFang SC\",\n    \"Hiragino Sans GB\", \"Microsoft YaHei\", system-ui, sans-serif;\n}\n.macos-desktop-host {\n  position: fixed;\n  inset: 0;\n  z-index: 30;\n  overflow: hidden;\n  pointer-events: none;\n}\n/* the host is parented to the parked native frame: undo its offset */\nhtml[data-macos-desktop] .macos-desktop-host { transform: none !important; }\nhtml[data-macos-desktop] .macos-desktop { transform: none !important; }\n.macos-desktop-host > * { pointer-events: auto; }\n.macos-desktop {\n  --mac-font: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"SF Pro Display\", \"Helvetica Neue\",\n    \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", system-ui, sans-serif;\n  --mac-menubar-h: 25px;\n  --mac-dock-h: 74px;\n  /* macOS text ramp: labelColor / secondaryLabelColor, and the SF Mono stack Apple uses */\n  --mac-label: #1d1d1f;\n  --mac-label-2: rgba(60, 60, 67, 0.6);\n  --mac-mono: \"SF Mono\", ui-monospace, \"JetBrains Mono\", Menlo, monospace;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n  font-family: var(--mac-font);\n  color: #1d1d1f;\n  font-weight: 400;\n  -webkit-font-smoothing: antialiased;\n  cursor: default;\n}\n.macos-desktop.dark {\n  --mac-label: #f5f5f7;\n  --mac-label-2: rgba(235, 235, 245, 0.6); color: #f5f5f7; }\n\n/* ---------- wallpaper ---------- */\n.macos-wallpaper {\n  position: absolute;\n  inset: 0;\n  background-color: #b9a7f2;\n  background-size: cover;\n  background-position: center center;\n  background-repeat: no-repeat;\n}\n.macos-wallpaper-tint {\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(120% 90% at 50% 120%, rgba(255, 255, 255, 0.10), transparent 60%),\n    linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02));\n  pointer-events: none;\n}\n\n/* ---------- desktop icons ---------- */\n.macos-desktop-area {\n  position: absolute;\n  top: calc(var(--mac-menubar-h) + 14px);\n  left: 16px;\n  right: 16px;\n  bottom: calc(var(--mac-dock-h) + 16px);\n  display: grid;\n  grid-auto-flow: column;\n  grid-template-rows: repeat(auto-fill, 100px);\n  grid-auto-columns: 100px;\n  gap: 4px;\n  align-content: start;\n  justify-content: start;\n  align-items: start;\n}\n.macos-icon-cell {\n  position: relative;\n  width: 100px;\n  height: 98px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 4px;\n  padding-top: 4px;\n  border-radius: 8px;\n  user-select: none;\n  -webkit-user-select: none;\n  cursor: default;\n}\n.macos-icon-cell.selected {\n  background: rgba(255, 255, 255, 0.22);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);\n}\n.macos-desktop.dark .macos-icon-cell.selected { background: rgba(255, 255, 255, 0.16); }\n.macos-icon-img {\n  width: 64px;\n  height: 64px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.28));\n}\n.macos-icon-img svg { width: 64px; height: 64px; display: block; }\n.macos-icon-label {\n  max-width: 92px;\n  padding: 1px 5px 2px;\n  border-radius: 5px;\n  font-size: 12px;\n  line-height: 15px;\n  text-align: center;\n  color: #fff;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.macos-icon-cell.selected .macos-icon-label { background: #0a68ff; text-shadow: none; }\n.macos-icon-cell-dot {\n  position: absolute;\n  bottom: 0;\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background: transparent;\n}\n.macos-icon-cell-dot.on { background: rgba(255, 255, 255, 0.85); }\n\n/* ---------- menubar ---------- */\n.macos-menubar {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: var(--mac-menubar-h);\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  padding: 0 10px 0 8px;\n  font-size: 13px;\n  color: #fff;\n  background: rgba(255, 255, 255, 0.22);\n  -webkit-backdrop-filter: saturate(180%) blur(24px);\n  backdrop-filter: saturate(180%) blur(24px);\n  box-shadow: inset 0 -0.5px 0 rgba(0, 0, 0, 0.14);\n  z-index: 60;\n  user-select: none;\n  -webkit-user-select: none;\n}\n.macos-menu-item {\n  display: flex;\n  align-items: center;\n  height: 19px;\n  padding: 0 8px;\n  border-radius: 5px;\n  font-size: 13px;\n  color: #fff;\n  cursor: default;\n  white-space: nowrap;\n  text-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.25);\n}\n.macos-menu-item:hover, .macos-menu-item.open { background: rgba(255, 255, 255, 0.26); }\n.macos-menu-item.appname { font-weight: 700; }\n.macos-menu-item.apple { padding: 0 9px; }\n.macos-menu-item.apple svg { width: 15px; height: 15px; display: block; fill: #fff; }\n.macos-menubar-spacer { flex: 1; }\n.macos-status { display: flex; align-items: center; gap: 2px; }\n.macos-status-ic {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 19px;\n  border-radius: 5px;\n}\n.macos-status-ic:hover { background: rgba(255, 255, 255, 0.26); }\n.macos-status-ic svg { width: 17px; height: 17px; display: block; fill: #fff; }\n.macos-status-badge {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  height: 19px;\n  padding: 0 7px;\n  border-radius: 5px;\n  font-size: 11.5px;\n  color: #fff;\n  text-shadow: none;\n}\n.macos-status-badge:hover { background: rgba(255, 255, 255, 0.26); }\n.macos-dot { width: 6px; height: 6px; border-radius: 50%; background: #34c759; box-shadow: 0 0 4px rgba(52, 199, 89, 0.7); }\n.macos-dot.warn { background: #ff9f0a; box-shadow: 0 0 4px rgba(255, 159, 10, 0.7); }\n.macos-date { padding: 0 6px; font-size: 13px; }\n.macos-clock { padding: 0 7px; font-size: 13px; font-variant-numeric: tabular-nums; }\n.macos-menubar-strip {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: var(--mac-menubar-h, 25px);\n  z-index: 2147483200;\n  pointer-events: none;\n}\n.macos-menubar-strip > .macos-menubar { position: absolute; }\n\n/* dropdown menus */\n.macos-menubar > .macos-menu,\n.macos-menu {\n  position: fixed;\n  top: calc(var(--mac-menubar-h) - 1px);\n  pointer-events: auto;\n  z-index: 2147483201;\n  min-width: 218px;\n  padding: 5px;\n  border-radius: 10px;\n  background: rgba(246, 246, 248, 0.86);\n  -webkit-backdrop-filter: saturate(180%) blur(28px);\n  backdrop-filter: saturate(180%) blur(28px);\n  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.16), 0 12px 32px rgba(0, 0, 0, 0.26);\n  color: #1d1d1f;\n}\n.macos-desktop.dark .macos-menu { background: rgba(44, 44, 48, 0.86); color: #f5f5f7; }\n.macos-menu.anchor-left { left: 6px; }\n.macos-menu-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 18px;\n  height: 22px;\n  padding: 0 9px;\n  border-radius: 5px;\n  font-size: 13px;\n  white-space: nowrap;\n}\n.macos-menu-row:hover { background: #0a68ff; color: #fff; }\n.macos-menu-hint { font-size: 12px; opacity: 0.6; }\n.macos-menu-sep { height: 1px; margin: 4px 9px; background: rgba(0, 0, 0, 0.12); }\n.macos-desktop.dark .macos-menu-sep { background: rgba(255, 255, 255, 0.14); }\n\n/* ---------- windows ---------- */\n.macos-windows {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  z-index: 40;\n}\n.macos-window {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  border-radius: 11px;\n  overflow: hidden;\n  background: #fff;\n  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.22), 0 18px 48px rgba(0, 0, 0, 0.32), 0 2px 6px rgba(0, 0, 0, 0.14);\n  pointer-events: auto;\n  transform-origin: center bottom;\n  animation: macos-win-open 220ms cubic-bezier(0.2, 0.9, 0.25, 1);\n}\n.macos-window.dark { background: #202124; }\n.macos-window.blurred { box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.18), 0 10px 30px rgba(0, 0, 0, 0.2); }\n.macos-window.zoomed { border-radius: 0; }\n@keyframes macos-win-open { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: none; } }\n.macos-window-body { flex: 1; min-height: 0; display: flex; flex-direction: column; position: relative; overflow: hidden; }\n/* the browser body is a see-through hole: ego-lite's own panel is floated over this window */\n.macos-window-body.ego { background: transparent; }\n.macos-ego-host { flex: 1; min-height: 0; display: flex; flex-direction: column; }\n.macos-ego-pane { flex: 1; min-height: 0; display: flex; flex-direction: column; }\n.macos-ego-pane > [data-slot] { flex: 1; min-height: 0; display: flex; flex-direction: column; }\n.macos-ego-pane [class*=\"ego-side-root\"] { flex: 1; min-height: 0; display: flex; flex-direction: column; }\n\n.macos-titlebar {\n  flex: none;\n  height: 34px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 0 10px;\n  background: linear-gradient(180deg, #f7f7f8, #ececee);\n  border-bottom: 0.5px solid rgba(0, 0, 0, 0.14);\n  user-select: none;\n  -webkit-user-select: none;\n  cursor: default;\n}\n.macos-window.dark .macos-titlebar { background: linear-gradient(180deg, #3a3a3e, #303034); border-bottom-color: rgba(0, 0, 0, 0.5); }\n.macos-lights { display: flex; align-items: center; gap: 8px; flex: none; }\n.macos-light {\n  width: 12px;\n  height: 12px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: default;\n  transition: filter 120ms;\n}\n.macos-light svg { width: 7px; height: 7px; opacity: 0; fill: rgba(0, 0, 0, 0.55); }\n.macos-lights:hover .macos-light svg { opacity: 1; }\n.macos-light.close { background: #ff5f57; box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.14); }\n.macos-light.min { background: #febc2e; box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.14); }\n.macos-light.zoom { background: #28c840; box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.14); }\n.macos-window.blurred .macos-light { background: #d4d4d6; box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.1); }\n.macos-window.blurred .macos-light svg { display: none; }\n.macos-title {\n  flex: 1;\n  min-width: 0;\n  text-align: center;\n  font-size: 13px;\n  font-weight: 600;\n  color: rgba(0, 0, 0, 0.78);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  margin-left: -44px;\n  padding-left: 44px;\n  pointer-events: none;\n}\n.macos-window.dark .macos-title { color: rgba(255, 255, 255, 0.82); }\n.macos-titlebar-right { display: flex; align-items: center; gap: 6px; flex: none; }\n.macos-tb-btn {\n  height: 21px;\n  padding: 0 9px;\n  border: 0;\n  border-radius: 5px;\n  background: rgba(0, 0, 0, 0.07);\n  color: rgba(0, 0, 0, 0.72);\n  font: inherit;\n  font-size: 11.5px;\n  cursor: default;\n}\n.macos-tb-btn:hover { background: rgba(0, 0, 0, 0.12); }\n.macos-window.dark .macos-tb-btn { background: rgba(255, 255, 255, 0.12); color: rgba(255, 255, 255, 0.85); }\n\n.macos-resize { position: absolute; z-index: 3; }\n.macos-resize[data-edge=\"n\"] { top: -3px; left: 10px; right: 10px; height: 7px; cursor: ns-resize; }\n.macos-resize[data-edge=\"s\"] { bottom: -3px; left: 10px; right: 10px; height: 7px; cursor: ns-resize; }\n.macos-resize[data-edge=\"w\"] { left: -3px; top: 10px; bottom: 10px; width: 7px; cursor: ew-resize; }\n.macos-resize[data-edge=\"e\"] { right: -3px; top: 10px; bottom: 10px; width: 7px; cursor: ew-resize; }\n.macos-resize[data-edge=\"nw\"] { top: -4px; left: -4px; width: 14px; height: 14px; cursor: nwse-resize; }\n.macos-resize[data-edge=\"ne\"] { top: -4px; right: -4px; width: 14px; height: 14px; cursor: nesw-resize; }\n.macos-resize[data-edge=\"sw\"] { bottom: -4px; left: -4px; width: 14px; height: 14px; cursor: nesw-resize; }\n.macos-resize[data-edge=\"se\"] { bottom: -4px; right: -4px; width: 14px; height: 14px; cursor: nwse-resize; }\n.macos-window.zoomed .macos-resize { display: none; }\n\n/* browser window body — the native ego panel shows through this hole */\n.macos-ego-host { flex: 1; min-height: 0; display: flex; flex-direction: column; background: #fff; }\n.macos-chat-host {\n  flex: 1;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  background: #fff;\n  box-shadow: inset 0 0.5px 0 rgba(0, 0, 0, 0.06);\n}\n.macos-window.dark .macos-chat-host { background: #202124; }\n.macos-window.dark .macos-ego-host { background: #202124; }\n.macos-ego-wait {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  padding: 24px;\n  text-align: center;\n  color: #6b6b70;\n  background: #fff;\n}\n.macos-ego-wait-title { font-size: 13.5px; font-weight: 600; color: #2b2b2f; }\n.macos-ego-wait-sub { font-size: 12px; max-width: 440px; line-height: 1.6; }\n.macos-spinner {\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  border: 2px solid rgba(0, 0, 0, 0.12);\n  border-top-color: #0a84ff;\n  animation: macos-spin 800ms linear infinite;\n}\n@keyframes macos-spin { to { transform: rotate(360deg); } }\n\n/* 废纸篓 window */\n.macos-trash-body {\n  flex: 1;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  color: rgba(0, 0, 0, 0.55);\n  font-size: 13px;\n  background: #fff;\n}\n.macos-window.dark .macos-trash-body { background: #26262a; color: rgba(255, 255, 255, 0.6); }\n.macos-trash-body .macos-icon-img { width: 84px; height: 84px; opacity: 0.9; }\n.macos-trash-body .macos-icon-img svg { width: 84px; height: 84px; }\n\n/* ---------- dock ---------- */\n.macos-dock-layer {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: var(--mac-dock-h);\n  display: flex;\n  align-items: flex-end;\n  justify-content: center;\n  padding-bottom: 8px;\n  z-index: 65;\n  pointer-events: none;\n}\n/* floating copies ride in the shell frame's overlay, which sits inside the parked frame */\nhtml[data-macos-desktop] .macos-overlay-root { position: fixed; inset: 0; z-index: 60; pointer-events: none; }\nhtml[data-macos-desktop] .macos-overlay-root > * { pointer-events: auto; }\nhtml[data-macos-desktop] .macos-overlay-root .macos-menubar-strip { position: fixed; top: 0; left: 0; right: 0; z-index: 2147483200; }\nhtml[data-macos-desktop] .macos-overlay-root .macos-dock-layer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483199; }\n.macos-dock {\n  display: flex;\n  align-items: flex-end;\n  gap: 7px;\n  height: 58px;\n  padding: 5px 7px 6px;\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.34);\n  -webkit-backdrop-filter: saturate(180%) blur(26px);\n  backdrop-filter: saturate(180%) blur(26px);\n  box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.4), 0 8px 26px rgba(0, 0, 0, 0.28), inset 0 0.5px 0 rgba(255, 255, 255, 0.55);\n  pointer-events: auto;\n}\n.macos-desktop.dark .macos-dock { background: rgba(60, 60, 66, 0.42); }\n.macos-dock-item {\n  position: relative;\n  width: 46px;\n  height: 46px;\n  display: flex;\n  align-items: flex-end;\n  justify-content: center;\n  border-radius: 11px;\n  cursor: default;\n  transition: transform 120ms ease-out;\n}\n.macos-dock-item .dock-icon { width: 46px; height: 46px; display: flex; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.26)); }\n.macos-dock-item .dock-icon svg { width: 46px; height: 46px; display: block; }\n.macos-dock-item.hover { transform: scale(1.28) translateY(-6px); }\n.macos-dock-item.hover-adj { transform: scale(1.12) translateY(-2px); }\n.macos-dock-tip {\n  position: absolute;\n  bottom: calc(100% + 6px);\n  left: 50%;\n  transform: translateX(-50%);\n  padding: 2px 8px 3px;\n  border-radius: 6px;\n  font-size: 11.5px;\n  color: #fff;\n  white-space: nowrap;\n  background: rgba(34, 34, 38, 0.82);\n  -webkit-backdrop-filter: blur(16px);\n  backdrop-filter: blur(16px);\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);\n  pointer-events: none;\n  z-index: 3;\n}\n.macos-dock-running {\n  position: absolute;\n  bottom: -6px;\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background: transparent;\n}\n.macos-dock-running.on { background: rgba(0, 0, 0, 0.45); }\n.macos-desktop.dark .macos-dock-running.on { background: rgba(255, 255, 255, 0.7); }\n.macos-dock-sep { width: 1px; height: 38px; margin: 0 3px; background: rgba(0, 0, 0, 0.16); align-self: center; }\n\n/* ---------- native plugin panel, floated as an app window's content ----------\n   The right-bar panel is real, interactive DOM. A \"software\" window is chrome around it: the\n   panel is positioned exactly over that window's body rect, so Monaco / Univer / ego keep working.\n   With no app using it the panel is clipped into a corner — still laid out (that keeps ego\n   streaming) but invisible and unclickable. */\n/* A native plugin panel is only the CONTENT of a window whose body is a hole; for every other\n   window (inactive, hole-less, or while the desktop is merely on) it must be out of the way.\n   `display:none` is what the runtime honours: ego pauses its own capture while its panel is not\n   displayed, which is exactly what this desktop wants when no app is showing it. */\nhtml[data-macos-desktop] [data-macos-panel=\"parked\"] [data-sidebar-right-panel] {\n  display: none !important;\n}\nhtml[data-macos-desktop] [data-sidebar-right-panel] {\n  /* a fixed popover: `inset:auto` first, or the popover UA style (inset:0, margin:auto) wins */\n  position: fixed !important;\n  inset: auto !important;\n  margin: 0 !important;\n  top: var(--mac-y, 0px) !important;\n  left: var(--mac-x, 0px) !important;\n  width: var(--mac-w, 100vw) !important;\n  height: calc(var(--mac-h, 100vh) - 40px) !important;\n  max-width: none !important;\n  max-height: none !important;\n  /* below the window chrome: window content sits at 520, the titlebar and the floating assistant\n     of the same window must stay above it, so the panel stops one layer short */\n  z-index: 510 !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  transform: none !important;\n  transition: none !important;\n  overflow: hidden !important;\n  pointer-events: auto !important;\n  background: #fff !important;\n  border: 0 !important;\n  border-radius: 0 0 10px 10px !important;\n  box-shadow: none !important;\n  clip-path: none !important;\n}\nhtml[data-macos-desktop][data-macos-panel=\"parked\"] [data-sidebar-right-panel] {\n  clip-path: inset(0 0 100% 100%) !important;\n  pointer-events: none !important;\n}\n/* the panel is one app surface now, so its own tab strip is redundant */\nhtml[data-macos-desktop] [data-sidebar-right-panel] [data-dockkit-host=\"tabstrip\"] { display: none !important; }\nhtml[data-macos-desktop] [data-sidebar-right-panel] [data-dockkit-host=\"dock\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [data-dockkit-pane] {\n  transform: none !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-height: none !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n}\n/* the session wrapper is display:contents — leave it alone */\nhtml[data-macos-desktop] [data-sidebar-right-session] {\n  visibility: visible !important;\n  pointer-events: auto !important;\n  transform: none !important;\n}\n\n/* minimized / unfocused windows are see-through: their window shows the page underneath */\nhtml[data-macos-desktop] {\n  --mac-card-bg: rgba(252, 252, 253, 0.66);\n  --mac-card-blur: saturate(180%) blur(24px);\n  --mac-titlebar-bg: rgba(247, 247, 248, 0.72);\n  --mac-win-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.2), 0 18px 50px rgba(0, 0, 0, 0.26), 0 2px 6px rgba(0, 0, 0, 0.12);\n}\nhtml[data-macos-desktop] .macos-desktop.dark {\n  --mac-card-bg: rgba(38, 38, 42, 0.72);\n  --mac-titlebar-bg: rgba(48, 48, 52, 0.72);\n  --mac-win-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 20px 54px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.3);\n}\nhtml[data-macos-desktop] .macos-window {\n  background: var(--mac-card-bg);\n  -webkit-backdrop-filter: var(--mac-card-blur);\n  backdrop-filter: var(--mac-card-blur);\n  box-shadow: var(--mac-win-shadow);\n  border-radius: 12px;\n  isolation: isolate;\n}\n/* the page of a browser / editor window is opaque; the chrome above and below it stays glass */\nhtml[data-macos-desktop] .macos-window .macos-window-body { background: transparent; }\nhtml[data-macos-desktop] .macos-titlebar {\n  background: var(--mac-titlebar-bg);\n  -webkit-backdrop-filter: saturate(180%) blur(24px);\n  backdrop-filter: saturate(180%) blur(24px);\n  border-bottom: 0.5px solid rgba(0, 0, 0, 0.12);\n  border-radius: 12px 12px 0 0;\n}\nhtml[data-macos-desktop] .macos-window.dark .macos-titlebar { border-bottom-color: rgba(255, 255, 255, 0.1); }\nhtml[data-macos-desktop] .macos-window-body { background: transparent; }\n\n\n/* ---------- floating chrome above the ego panel ---------- */\nhtml[data-macos-desktop] .macos-root { position: fixed !important; inset: 0 !important; z-index: 30 !important; }\n/* The ego panel is a pure carrier while the desktop runs: ego's capture follows the *visible*\n   viewport, so a parked panel at 0,0 would re-capture the desktop itself. It keeps a sub-pixel box\n   inside the viewport (a display:none / off-screen box pauses ego's stream), stays transparent,\n   and nothing of it is clickable. */\n/* the ego pane rendered into our window takes ego's own sizing back to full height */\nhtml[data-macos-desktop] .macos-ego-host [data-slot=\"sidebar.right.pane.tab\"],\nhtml[data-macos-desktop] .macos-ego-host [class*=\"ego-side-root\"] { height: 100%; min-height: 0; }\nhtml[data-macos-desktop] .macos-ego-host { display: flex; flex-direction: column; }\nhtml[data-macos-desktop] .macos-ego-host [class*=\"ego-side-liveimg\"] { max-height: none; object-fit: contain; }\n\n/* ego's view render target: the floated panel paints its content over the browser window body */\nhtml[data-macos-desktop] .macos-ego-holder,\n.macos-ego-holder.macos-ego-echo {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 1100px;\n  height: 720px;\n  visibility: hidden;\n  pointer-events: none;\n  overflow: hidden;\n  z-index: 1;\n}\n/* ego keeps drawing its own sidebar chrome; once the pane lives in the window, the page fills it */\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-head\"] { display: none !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-pageinfo\"] { display: none !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-tabs\"],\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-statusline\"] { display: none !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-livebadge\"] { display: none !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-body\"] { border: 0 !important; border-radius: 0 !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-root\"] { height: 100% !important; overflow: hidden !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-body\"] {\n  flex: 1 1 auto !important;\n  min-height: 0 !important;\n  height: auto !important;\n  overflow: auto !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-liveview\"] {\n  flex: 1 1 auto !important;\n  min-height: 0 !important;\n  height: 100% !important;\n  overflow: hidden !important;\n}\n/* ego caps its frame at 50vh for a sidebar tab and keeps the real pixels in overlay layers;\n   a window shows the page edge to edge, so the black stage goes away entirely */\nhtml[data-macos-desktop] .macos-ego-host { overflow: hidden !important; }\nhtml[data-macos-desktop] .macos-ego-pane { flex: 1 1 auto !important; min-height: 0 !important; overflow: hidden !important; }\nhtml[data-macos-desktop] .macos-ego-pane [data-slot] { flex: 1 1 auto !important; min-height: 0 !important; overflow: hidden !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-liveview\"] {\n  flex: 1 1 auto !important;\n  min-height: 0 !important;\n  height: 100% !important;\n  overflow: hidden !important;\n  overflow: clip !important;\n  background: #fff !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-livebox\"] {\n  flex: 1 1 0 !important;\n  min-height: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-height: 100% !important;\n  aspect-ratio: auto !important;\n  background: #fff !important;\n  border-radius: 0 !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-liveimg\"] {\n  height: 100% !important;\n  max-height: none !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-liveview\"] { border-radius: 0 !important; }\n/* the swapped overlay buffers must cover the box: only the semantic frame may letterbox */\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-livebuf\"] {\n  position: absolute !important;\n  z-index: 0 !important;\n  inset: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-height: none !important;\n  object-fit: cover !important;\n  object-position: top center !important;\n  border: 0 !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-livebadge\"],\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-actionline\"] { display: none !important; }\n/* the live frame is painted by ego itself, so the window keeps only its chrome */\nhtml[data-macos-desktop] .macos-window-body.ego { background: #fff; }\n/* while the pane is still inside the floated panel it paints nothing: the window owns it */\nhtml[data-macos-desktop] .macos-ego-pane { display: flex !important; flex-direction: column; background: #fff; }\n/* the native ego tab body stays parked: only the desktop layer is visible */\nhtml[data-macos-desktop] .macos-ego-wait { background: #fff; }\n/* the page itself is clicked through the window body: only the chrome takes the pointer */\nhtml[data-macos-desktop] .macos-ego-host { pointer-events: none !important; }\n/* the browser window is a frame around ego's pane; it must never paint over it */\nhtml[data-macos-desktop] .macos-ego-host .macos-window,\nhtml[data-macos-desktop] .macos-ego-host .macos-desktop,\nhtml[data-macos-desktop] .macos-ego-host .macos-ego-pane { background: #fff !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }\nhtml[data-macos-desktop] [data-macos-chrome],\nhtml[data-macos-desktop] [data-macos-chrome] * { pointer-events: auto !important; }\n\n/* ---------- sheets ---------- */\n.macos-sheet-backdrop {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(0, 0, 0, 0.18);\n  z-index: 80;\n  animation: macos-fade 160ms ease-out;\n}\n@keyframes macos-fade { from { opacity: 0; } to { opacity: 1; } }\n.macos-sheet {\n  width: 320px;\n  padding: 22px 20px 16px;\n  border-radius: 14px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  text-align: center;\n  background: rgba(248, 248, 250, 0.94);\n  -webkit-backdrop-filter: saturate(180%) blur(28px);\n  backdrop-filter: saturate(180%) blur(28px);\n  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.16), 0 24px 60px rgba(0, 0, 0, 0.34);\n  color: #1d1d1f;\n  animation: macos-sheet-in 200ms cubic-bezier(0.2, 0.9, 0.25, 1);\n}\n@keyframes macos-sheet-in { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: none; } }\n.macos-desktop.dark .macos-sheet { background: rgba(44, 44, 48, 0.94); color: #f5f5f7; }\n.macos-chat-logo { width: 64px; height: 64px; display: flex; filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25)); }\n.macos-chat-logo svg { width: 64px; height: 64px; }\n.macos-sheet-title { font-size: 17px; font-weight: 700; margin-top: 2px; }\n.macos-sheet-sub { font-size: 12px; opacity: 0.62; }\n.macos-sheet-meta { font-size: 11.5px; opacity: 0.55; }\n.macos-sheet-actions { display: flex; gap: 10px; margin-top: 12px; width: 100%; }\n.macos-btn {\n  flex: 1;\n  height: 30px;\n  border: 0;\n  border-radius: 7px;\n  font: inherit;\n  font-size: 13px;\n  cursor: default;\n  background: rgba(0, 0, 0, 0.07);\n  color: inherit;\n}\n.macos-btn:hover { background: rgba(0, 0, 0, 0.12); }\n.macos-btn.primary { background: #0a84ff; color: #fff; }\n.macos-btn.primary:hover { background: #0a7cf2; }\n\n/* entry capsule shown in the native GUI: a thin glass pill, the way macOS floats\n   system chrome (no label, no drop shadow ring - it rests on the wallpaper) */\n.macos-launch {\n  position: fixed;\n  right: 14px;\n  bottom: 14px;\n  height: 26px;\n  width: 44px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  border: 0;\n  border-radius: 999px;\n  color: rgba(20, 20, 22, 0.82);\n  cursor: default;\n  pointer-events: auto;\n  z-index: 2147483000;\n  background: rgba(255, 255, 255, 0.42);\n  -webkit-backdrop-filter: saturate(180%) blur(22px);\n  backdrop-filter: saturate(180%) blur(22px);\n  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08), inset 0 0.5px 0 rgba(255, 255, 255, 0.55);\n  transition: width 160ms ease, background 160ms ease;\n}\n.macos-launch:hover { width: 84px; background: rgba(255, 255, 255, 0.66); }\n.macos-launch-ic { display: flex; align-items: center; justify-content: center; }\n.macos-launch-ic svg { width: 14px; height: 14px; display: block; }\n.macos-launch-txt {\n  max-width: 0;\n  opacity: 0;\n  overflow: hidden;\n  white-space: nowrap;\n  font-size: 11.5px;\n  font-weight: 590;\n  letter-spacing: 0.01em;\n  transition: max-width 160ms ease, opacity 160ms ease, margin 160ms ease;\n}\n.macos-launch:hover .macos-launch-txt { max-width: 48px; opacity: 1; margin-left: 5px; }\n.macos-desktop.dark ~ .macos-launch { color: rgba(245, 245, 247, 0.9); }\n.macos-overlay-root { position: fixed; inset: 0; z-index: 60; pointer-events: none; }\nhtml[data-macos-desktop] .macos-overlay-root > * { pointer-events: auto; }\nhtml[data-macos-desktop] .macos-overlay-root .macos-menubar-strip { position: fixed; top: 0; left: 0; right: 0; z-index: 2147483200; }\nhtml[data-macos-desktop] .macos-overlay-root .macos-dock-layer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483199; }\n.macos-dock {\n  display: flex;\n  align-items: flex-end;\n  gap: 7px;\n  height: 58px;\n  padding: 5px 7px 6px;\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.34);\n  -webkit-backdrop-filter: saturate(180%) blur(26px);\n  backdrop-filter: saturate(180%) blur(26px);\n  box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.4), 0 8px 26px rgba(0, 0, 0, 0.28), inset 0 0.5px 0 rgba(255, 255, 255, 0.55);\n  pointer-events: auto;\n}\n.macos-desktop.dark .macos-dock { background: rgba(60, 60, 66, 0.42); }\n.macos-dock-item {\n  position: relative;\n  width: 46px;\n  height: 46px;\n  display: flex;\n  align-items: flex-end;\n  justify-content: center;\n  border-radius: 11px;\n  cursor: default;\n  transition: transform 120ms ease-out;\n}\n.macos-dock-item .dock-icon { width: 46px; height: 46px; display: flex; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.26)); }\n.macos-dock-item .dock-icon svg { width: 46px; height: 46px; display: block; }\n.macos-dock-item.hover { transform: scale(1.28) translateY(-6px); }\n.macos-dock-item.hover-adj { transform: scale(1.12) translateY(-2px); }\n.macos-dock-tip {\n  position: absolute;\n  bottom: calc(100% + 6px);\n  left: 50%;\n  transform: translateX(-50%);\n  padding: 2px 8px 3px;\n  border-radius: 6px;\n  font-size: 11.5px;\n  color: #fff;\n  white-space: nowrap;\n  background: rgba(34, 34, 38, 0.82);\n  -webkit-backdrop-filter: blur(16px);\n  backdrop-filter: blur(16px);\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);\n  pointer-events: none;\n  z-index: 3;\n}\n.macos-dock-running {\n  position: absolute;\n  bottom: -6px;\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background: transparent;\n}\n.macos-dock-running.on { background: rgba(0, 0, 0, 0.45); }\n.macos-desktop.dark .macos-dock-running.on { background: rgba(255, 255, 255, 0.7); }\n.macos-dock-sep { width: 1px; height: 38px; margin: 0 3px; background: rgba(0, 0, 0, 0.16); align-self: center; }\n\n/* ---------- native plugin panel, floated as an app window's content ----------\n   The right-bar panel is real, interactive DOM. A \"software\" window is chrome around it: the\n   panel is positioned exactly over that window's body rect, so Monaco / Univer / ego keep working.\n   With no app using it the panel is clipped into a corner — still laid out (that keeps ego\n   streaming) but invisible and unclickable. */\n/* A native plugin panel is only the CONTENT of a window whose body is a hole; for every other\n   window (inactive, hole-less, or while the desktop is merely on) it must be out of the way.\n   `display:none` is what the runtime honours: ego pauses its own capture while its panel is not\n   displayed, which is exactly what this desktop wants when no app is showing it. */\nhtml[data-macos-desktop] [data-macos-panel=\"parked\"] [data-sidebar-right-panel] {\n  display: none !important;\n}\nhtml[data-macos-desktop] [data-sidebar-right-panel] {\n  /* a fixed popover: `inset:auto` first, or the popover UA style (inset:0, margin:auto) wins */\n  position: fixed !important;\n  inset: auto !important;\n  margin: 0 !important;\n  top: var(--mac-y, 0px) !important;\n  left: var(--mac-x, 0px) !important;\n  width: var(--mac-w, 100vw) !important;\n  height: calc(var(--mac-h, 100vh) - 40px) !important;\n  max-width: none !important;\n  max-height: none !important;\n  /* below the window chrome: window content sits at 520, the titlebar and the floating assistant\n     of the same window must stay above it, so the panel stops one layer short */\n  z-index: 510 !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  transform: none !important;\n  transition: none !important;\n  overflow: hidden !important;\n  pointer-events: auto !important;\n  background: #fff !important;\n  border: 0 !important;\n  border-radius: 0 0 10px 10px !important;\n  box-shadow: none !important;\n  clip-path: none !important;\n}\nhtml[data-macos-desktop][data-macos-panel=\"parked\"] [data-sidebar-right-panel] {\n  clip-path: inset(0 0 100% 100%) !important;\n  pointer-events: none !important;\n}\n/* the panel is one app surface now, so its own tab strip is redundant */\nhtml[data-macos-desktop] [data-sidebar-right-panel] [data-dockkit-host=\"tabstrip\"] { display: none !important; }\nhtml[data-macos-desktop] [data-sidebar-right-panel] [data-dockkit-host=\"dock\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [data-dockkit-pane] {\n  transform: none !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-height: none !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n}\n/* the session wrapper is display:contents — leave it alone */\nhtml[data-macos-desktop] [data-sidebar-right-session] {\n  visibility: visible !important;\n  pointer-events: auto !important;\n  transform: none !important;\n}\n\n/* minimized / unfocused windows are see-through: their window shows the page underneath */\nhtml[data-macos-desktop] {\n  --mac-card-bg: rgba(252, 252, 253, 0.66);\n  --mac-card-blur: saturate(180%) blur(24px);\n  --mac-titlebar-bg: rgba(247, 247, 248, 0.72);\n  --mac-win-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.2), 0 18px 50px rgba(0, 0, 0, 0.26), 0 2px 6px rgba(0, 0, 0, 0.12);\n}\nhtml[data-macos-desktop] .macos-desktop.dark {\n  --mac-card-bg: rgba(38, 38, 42, 0.72);\n  --mac-titlebar-bg: rgba(48, 48, 52, 0.72);\n  --mac-win-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 20px 54px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.3);\n}\nhtml[data-macos-desktop] .macos-window {\n  background: var(--mac-card-bg);\n  -webkit-backdrop-filter: var(--mac-card-blur);\n  backdrop-filter: var(--mac-card-blur);\n  box-shadow: var(--mac-win-shadow);\n  border-radius: 12px;\n  isolation: isolate;\n}\n/* the page of a browser / editor window is opaque; the chrome above and below it stays glass */\nhtml[data-macos-desktop] .macos-window .macos-window-body { background: transparent; }\nhtml[data-macos-desktop] .macos-titlebar {\n  background: var(--mac-titlebar-bg);\n  -webkit-backdrop-filter: saturate(180%) blur(24px);\n  backdrop-filter: saturate(180%) blur(24px);\n  border-bottom: 0.5px solid rgba(0, 0, 0, 0.12);\n  border-radius: 12px 12px 0 0;\n}\nhtml[data-macos-desktop] .macos-window.dark .macos-titlebar { border-bottom-color: rgba(255, 255, 255, 0.1); }\nhtml[data-macos-desktop] .macos-window-body { background: transparent; }\n\n\n/* ---------- floating chrome above the ego panel ---------- */\nhtml[data-macos-desktop] .macos-root { position: fixed !important; inset: 0 !important; z-index: 30 !important; }\n/* The ego panel is a pure carrier while the desktop runs: ego's capture follows the *visible*\n   viewport, so a parked panel at 0,0 would re-capture the desktop itself. It keeps a sub-pixel box\n   inside the viewport (a display:none / off-screen box pauses ego's stream), stays transparent,\n   and nothing of it is clickable. */\n/* the ego pane rendered into our window takes ego's own sizing back to full height */\nhtml[data-macos-desktop] .macos-ego-host [data-slot=\"sidebar.right.pane.tab\"],\nhtml[data-macos-desktop] .macos-ego-host [class*=\"ego-side-root\"] { height: 100%; min-height: 0; }\nhtml[data-macos-desktop] .macos-ego-host { display: flex; flex-direction: column; }\nhtml[data-macos-desktop] .macos-ego-host [class*=\"ego-side-liveimg\"] { max-height: none; object-fit: contain; }\n\n/* ego's view render target: the floated panel paints its content over the browser window body */\nhtml[data-macos-desktop] .macos-ego-holder,\n.macos-ego-holder.macos-ego-echo {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 1100px;\n  height: 720px;\n  visibility: hidden;\n  pointer-events: none;\n  overflow: hidden;\n  z-index: 1;\n}\n/* ego keeps drawing its own sidebar chrome; once the pane lives in the window, the page fills it */\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-head\"] { display: none !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-pageinfo\"] { display: none !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-tabs\"],\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-statusline\"] { display: none !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-livebadge\"] { display: none !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-body\"] { border: 0 !important; border-radius: 0 !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-root\"] { height: 100% !important; overflow: hidden !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-body\"] {\n  flex: 1 1 auto !important;\n  min-height: 0 !important;\n  height: auto !important;\n  overflow: auto !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-liveview\"] {\n  flex: 1 1 auto !important;\n  min-height: 0 !important;\n  height: 100% !important;\n  overflow: hidden !important;\n}\n/* ego caps its frame at 50vh for a sidebar tab and keeps the real pixels in overlay layers;\n   a window shows the page edge to edge, so the black stage goes away entirely */\nhtml[data-macos-desktop] .macos-ego-host { overflow: hidden !important; }\nhtml[data-macos-desktop] .macos-ego-pane { flex: 1 1 auto !important; min-height: 0 !important; overflow: hidden !important; }\nhtml[data-macos-desktop] .macos-ego-pane [data-slot] { flex: 1 1 auto !important; min-height: 0 !important; overflow: hidden !important; }\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-liveview\"] {\n  flex: 1 1 auto !important;\n  min-height: 0 !important;\n  height: 100% !important;\n  overflow: hidden !important;\n  overflow: clip !important;\n  background: #fff !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-livebox\"] {\n  flex: 1 1 0 !important;\n  min-height: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-height: 100% !important;\n  aspect-ratio: auto !important;\n  background: #fff !important;\n  border-radius: 0 !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-liveimg\"] {\n  height: 100% !important;\n  max-height: none !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-liveview\"] { border-radius: 0 !important; }\n/* the swapped overlay buffers must cover the box: only the semantic frame may letterbox */\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-livebuf\"] {\n  position: absolute !important;\n  z-index: 0 !important;\n  inset: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-height: none !important;\n  object-fit: cover !important;\n  object-position: top center !important;\n  border: 0 !important;\n}\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-livebadge\"],\nhtml[data-macos-desktop] .macos-ego-pane [class*=\"ego-side-actionline\"] { display: none !important; }\n/* the live frame is painted by ego itself, so the window keeps only its chrome */\nhtml[data-macos-desktop] .macos-window-body.ego { background: #fff; }\n/* while the pane is still inside the floated panel it paints nothing: the window owns it */\nhtml[data-macos-desktop] .macos-ego-pane { display: flex !important; flex-direction: column; background: #fff; }\n/* the native ego tab body stays parked: only the desktop layer is visible */\nhtml[data-macos-desktop] .macos-ego-wait { background: #fff; }\n/* the page itself is clicked through the window body: only the chrome takes the pointer */\nhtml[data-macos-desktop] .macos-ego-host { pointer-events: none !important; }\n/* the browser window is a frame around ego's pane; it must never paint over it */\nhtml[data-macos-desktop] .macos-ego-host .macos-window,\nhtml[data-macos-desktop] .macos-ego-host .macos-desktop,\nhtml[data-macos-desktop] .macos-ego-host .macos-ego-pane { background: #fff !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }\nhtml[data-macos-desktop] [data-macos-chrome],\nhtml[data-macos-desktop] [data-macos-chrome] * { pointer-events: auto !important; }\n\n/* ---------- sheets ---------- */\n.macos-sheet-backdrop {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(0, 0, 0, 0.18);\n  z-index: 80;\n  animation: macos-fade 160ms ease-out;\n}\n@keyframes macos-fade { from { opacity: 0; } to { opacity: 1; } }\n.macos-sheet {\n  width: 320px;\n  padding: 22px 20px 16px;\n  border-radius: 14px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  text-align: center;\n  background: rgba(248, 248, 250, 0.94);\n  -webkit-backdrop-filter: saturate(180%) blur(28px);\n  backdrop-filter: saturate(180%) blur(28px);\n  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.16), 0 24px 60px rgba(0, 0, 0, 0.34);\n  color: #1d1d1f;\n  animation: macos-sheet-in 200ms cubic-bezier(0.2, 0.9, 0.25, 1);\n}\n@keyframes macos-sheet-in { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: none; } }\n.macos-desktop.dark .macos-sheet { background: rgba(44, 44, 48, 0.94); color: #f5f5f7; }\n.macos-chat-logo { width: 64px; height: 64px; display: flex; filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25)); }\n.macos-chat-logo svg { width: 64px; height: 64px; }\n.macos-sheet-title { font-size: 17px; font-weight: 700; margin-top: 2px; }\n.macos-sheet-sub { font-size: 12px; opacity: 0.62; }\n.macos-sheet-meta { font-size: 11.5px; opacity: 0.55; }\n.macos-sheet-actions { display: flex; gap: 10px; margin-top: 12px; width: 100%; }\n.macos-btn {\n  flex: 1;\n  height: 30px;\n  border: 0;\n  border-radius: 7px;\n  font: inherit;\n  font-size: 13px;\n  cursor: default;\n  background: rgba(0, 0, 0, 0.07);\n  color: inherit;\n}\n.macos-btn:hover { background: rgba(0, 0, 0, 0.12); }\n.macos-btn.primary { background: #0a84ff; color: #fff; }\n.macos-btn.primary:hover { background: #0a7cf2; }\n\n/* entry pill shown in the native GUI */\n.macos-launch {\n  position: fixed;\n  right: 18px;\n  bottom: 18px;\n  height: 32px;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 0 12px 0 10px;\n  border: 0;\n  border-radius: 16px;\n  font-size: 12.5px;\n  font-weight: 600;\n  color: #0b0b0f;\n  cursor: default;\n  pointer-events: auto;\n  background: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.14), 0 6px 18px rgba(0, 0, 0, 0.18);\n  z-index: 2147483000;\n}\n.macos-launch:hover { background: #fff; }\n.macos-launch-ic { display: flex; }\n.macos-launch-ic svg { width: 15px; height: 15px; display: block; }\n.macos-overlay-root { position: fixed; inset: 0; pointer-events: none; z-index: 25; }\n.macos-overlay-root > * { pointer-events: auto; }\n\n/* small screens (phone remote control) */\n@media (max-width: 760px) {\n  .macos-menu-item.hide-sm, .macos-date.hide-sm { display: none; }\n  .macos-desktop { --mac-menubar-h: 24px; --mac-dock-h: 62px; }\n  .macos-desktop-area {\n    top: calc(var(--mac-menubar-h) + 8px);\n    left: 8px;\n    right: 8px;\n    bottom: calc(var(--mac-dock-h) + 8px);\n    grid-template-rows: repeat(auto-fill, 84px);\n    grid-auto-columns: 84px;\n  }\n  .macos-icon-cell { width: 84px; height: 82px; }\n  .macos-icon-img, .macos-icon-img svg { width: 52px; height: 52px; }\n  .macos-dock { height: 50px; gap: 5px; padding: 4px 6px 5px; border-radius: 15px; }\n  .macos-dock-item, .macos-dock-item .dock-icon, .macos-dock-item .dock-icon svg { width: 40px; height: 40px; }\n  .macos-dock-item.hover { transform: scale(1.1); }\n  .macos-dock-item.hover-adj { transform: none; }\n  .macos-menu { min-width: 190px; }\n  .macos-launch { right: 10px; bottom: 10px; height: 24px; width: 40px; }\n  .macos-launch:hover { width: 40px; }\n}\n\n/* ---------------- desktop apps: plugin surfaces floated into windows ---------------- */\n/* a right-bar seat is only a carrier: its body is floated into the desktop window by inline\n   geometry, so the native seat itself never paints */\n/* the desktop replaces the conversation and the workspace sidebar: no native left column.\n   The park moves the frame by its margin box, so no transform / containment may sit on an\n   ancestor of a floated node or the float would be laid out against an off-screen box. */\nhtml[data-macos-desktop] [class*=\"_sidebarCol\"]:not([data-macos-float-code]):not([data-macos-float-notes]) { display: none !important; }\nhtml[data-macos-desktop] .macos-window-body.hole { background: transparent; pointer-events: none; }\nhtml[data-macos-desktop] .macos-app-void { flex: 1; display: flex; align-items: center; justify-content: center; background: #fff; }\nhtml[data-macos-desktop] .macos-app-void.ready { background: transparent; }\nhtml[data-macos-desktop] .macos-void-inner { text-align: center; color: #6b6b70; font-size: 13px; display: flex; flex-direction: column; align-items: center; gap: 8px; }\n\nhtml[data-macos-desktop] .macos-term { flex: 1; display: flex; flex-direction: column; background: #1e1e20; color: #eaeaea; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; }\nhtml[data-macos-desktop] .macos-term-out { flex: 1; overflow: auto; padding: 10px 14px; }\nhtml[data-macos-desktop] .macos-term-line { margin: 0 0 2px; white-space: pre-wrap; word-break: break-word; font-family: inherit; }\nhtml[data-macos-desktop] .macos-term-line.cmd { color: #9ad3ff; }\nhtml[data-macos-desktop] .macos-term-hint { opacity: .55; }\nhtml[data-macos-desktop] .macos-term-in { display: flex; gap: 8px; align-items: center; border-top: 1px solid #333; padding: 8px 14px; }\nhtml[data-macos-desktop] .macos-term-in input { flex: 1; background: transparent; border: 0; outline: 0; color: #fff; font: inherit; }\nhtml[data-macos-desktop] .macos-term-prompt { color: #7ee787; }\n\nhtml[data-macos-desktop] .macos-finder { flex: 1; display: flex; min-height: 0; }\nhtml[data-macos-desktop] .macos-finder-side { width: 190px; background: rgba(246,246,248,.96); border-right: 1px solid rgba(0,0,0,.08); overflow: auto; padding: 8px 6px; }\nhtml[data-macos-desktop] .macos-finder-side-head { font-size: 11px; font-weight: 600; color: #8a8a8f; padding: 10px 10px 4px; }\nhtml[data-macos-desktop] .macos-finder-side-row { padding: 4px 10px; border-radius: 6px; cursor: default; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\nhtml[data-macos-desktop] .macos-finder-side-row.on { background: rgba(0,122,255,.14); }\nhtml[data-macos-desktop] .macos-finder-side-row.sub { padding-left: 20px; font-size: 12px; }\nhtml[data-macos-desktop] .macos-finder-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }\nhtml[data-macos-desktop] .macos-finder-path { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-bottom: 1px solid rgba(0,0,0,.07); font-size: 12px; color: #555; }\nhtml[data-macos-desktop] .macos-finder-crumb { cursor: default; }\nhtml[data-macos-desktop] .macos-finder-grid { flex: 1; overflow: auto; padding: 14px; display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; align-content: start; }\nhtml[data-macos-desktop] .macos-finder-item { display: flex; flex-direction: column; align-items: center; gap: 6px; background: transparent; border: 0; padding: 8px 4px; border-radius: 8px; cursor: default; }\nhtml[data-macos-desktop] .macos-finder-item:hover { background: rgba(0,0,0,.05); }\nhtml[data-macos-desktop] .macos-finder-ic svg { width: 40px; height: 40px; }\nhtml[data-macos-desktop] .macos-finder-ext { display: inline-flex; width: 40px; height: 40px; align-items: center; justify-content: center; border-radius: 8px; background: #e8e8ed; color: #666; font-size: 10px; text-transform: uppercase; }\nhtml[data-macos-desktop] .macos-finder-name { font-size: 11.5px; max-width: 96px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\nhtml[data-macos-desktop] .macos-finder-err { color: #b00020; font-size: 12px; padding: 8px 14px; }\n\nhtml[data-macos-desktop] .macos-office { flex: 1; display: flex; min-height: 0; }\nhtml[data-macos-desktop] .macos-office-side { width: 200px; border-right: 1px solid rgba(0,0,0,.08); background: rgba(246,246,248,.96); overflow: auto; padding: 6px; }\nhtml[data-macos-desktop] .macos-office-empty { padding: 10px; font-size: 12px; color: #777; line-height: 1.5; }\nhtml[data-macos-desktop] .macos-office-main { flex: 1; min-width: 0; }\nhtml[data-macos-desktop] .macos-office-frame { width: 100%; height: 100%; border: 0; display: block; background: #fff; }\nhtml[data-macos-desktop] .macos-office-hint { padding: 24px; color: #777; }\n\nhtml[data-macos-desktop] .macos-settings { flex: 1; overflow: auto; padding: 18px 22px; }\nhtml[data-macos-desktop] .macos-settings h3 { margin: 18px 0 6px; font-size: 13px; }\nhtml[data-macos-desktop] .macos-settings-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,.05); }\nhtml[data-macos-desktop] .macos-settings-name { flex: 1; }\nhtml[data-macos-desktop] .macos-settings-kind { font-size: 11px; color: #888; }\nhtml[data-macos-desktop] .macos-btn.sm { font-size: 11.5px; padding: 3px 10px; border-radius: 6px; }\n\n/* ---------- software windows hosting a plugin page ---------- */\n.macos-pane { position: relative; flex: 1 1 auto; min-height: 0; display: flex; background: #fff; }\n.macos-pane-frame {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  background: #fff;\n  opacity: 0;\n  transition: opacity .18s ease;\n}\n.macos-pane.loaded .macos-pane-frame { opacity: 1; }\n.macos-pane-wait {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  background: #fff;\n  color: #1d1d1f;\n  font: 13px/1.5 var(--mac-font);\n}\n.macos-pane.loaded .macos-pane-wait { display: none; }\n.macos-tb-group { display: flex; align-items: center; gap: 4px; }\n\n/* a window whose content is the native panel: its body is a hole, the panel shows through */\nhtml[data-macos-desktop] .macos-window-body.hole { background: transparent !important; pointer-events: none !important; }\nhtml[data-macos-desktop] .macos-window.hole-win { background: transparent !important; }\n\n/* a pane-app window is chrome around the native panel, so it stacks above the other windows\n   (real z-index, not a stacking context: a blurred filter here would trap the panel's layers) */\nhtml[data-macos-desktop] .macos-window.hole-win { z-index: 520 !important; }\nhtml[data-macos-desktop] .macos-finder-folder svg { width: 40px; height: 40px; }\nhtml[data-macos-desktop] .macos-finder-crumb { cursor: default; color: #333; }\nhtml[data-macos-desktop] .macos-finder-crumb:hover { color: #0a6cff; }\nhtml[data-macos-desktop] .macos-finder-sep { color: #999; margin: 0 2px; }\n\n/* ---------- desktop browser window (second ego-lite Chromium, owned by the Host half) ---------- */\nhtml[data-macos-desktop] .macos-browser-app { flex: 1; display: flex; flex-direction: column; min-height: 0; background: #fff; }\nhtml[data-macos-desktop] .macos-browser-bar {\n  display: flex; align-items: center; gap: 6px; padding: 7px 10px;\n  background: #f2f2f4; border-bottom: 1px solid rgba(0,0,0,.09);\n}\nhtml[data-macos-desktop] .macos-browser-btn {\n  width: 24px; height: 24px; border: 0; border-radius: 6px; background: transparent;\n  font-size: 15px; line-height: 1; color: #444; cursor: default;\n}\nhtml[data-macos-desktop] .macos-browser-btn:hover { background: rgba(0,0,0,.07); }\nhtml[data-macos-desktop] .macos-browser-url { flex: 1; display: flex; }\nhtml[data-macos-desktop] .macos-browser-url input {\n  flex: 1; height: 24px; border: 1px solid rgba(0,0,0,.12); border-radius: 6px;\n  background: #fff; padding: 0 8px; font-size: 12px; font-family: inherit; color: #222; outline: none;\n}\nhtml[data-macos-desktop] .macos-browser-url input:focus { border-color: rgba(0,122,255,.6); box-shadow: 0 0 0 3px rgba(0,122,255,.18); }\nhtml[data-macos-desktop] .macos-browser-view { position: relative; flex: 1; min-height: 0; overflow: hidden; background: #fff; }\nhtml[data-macos-desktop] .macos-browser-frame { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; display: block; background: #fff; }\nhtml[data-macos-desktop] .macos-browser-status {\n  height: 24px; display: flex; align-items: center; padding: 0 12px;\n  font-size: 11.5px; color: #6d6d72; background: #f7f7f8; border-top: 1px solid rgba(0,0,0,.07);\n  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\n}\nhtml[data-macos-desktop] .macos-desktop.dark .macos-browser-bar { background: #2a2a2c; border-bottom-color: rgba(255,255,255,.08); }\nhtml[data-macos-desktop] .macos-desktop.dark .macos-browser-status { background: #232325; color: #a0a0a5; border-top-color: rgba(255,255,255,.07); }\n\n/* ---------- browser window: the real ego tabs, one picture per tab ---------- */\nhtml[data-macos-desktop] .macos-browser-tabs {\n  display: flex;\n  align-items: flex-end;\n  gap: 6px;\n  padding: 6px 10px 0;\n  min-height: 34px;\n  overflow-x: auto;\n  scrollbar-width: none;\n  background: var(--mac-titlebar-bg, rgba(255, 255, 255, 0.72));\n  backdrop-filter: var(--mac-card-blur, saturate(180%) blur(24px));\n  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);\n}\nhtml[data-macos-desktop] .macos-browser-tabs::-webkit-scrollbar { display: none; }\nhtml[data-macos-desktop] .macos-browser-tab {\n  appearance: none;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  max-width: 220px;\n  min-width: 96px;\n  height: 28px;\n  padding: 0 10px;\n  border: 0;\n  border-radius: 8px 8px 0 0;\n  background: transparent;\n  color: rgba(0, 0, 0, 0.62);\n  font: inherit;\n  font-size: 12px;\n  cursor: default;\n}\nhtml[data-macos-desktop] .macos-browser-tab:hover { background: rgba(0, 0, 0, 0.05); }\nhtml[data-macos-desktop] .macos-browser-tab.on { background: rgba(255, 255, 255, 0.92); color: rgba(0, 0, 0, 0.88); box-shadow: 0 -0.5px 0 rgba(0, 0, 0, 0.08), 0.5px 0 0 rgba(0, 0, 0, 0.06), -0.5px 0 0 rgba(0, 0, 0, 0.06); }\nhtml[data-macos-desktop] .macos-browser-tab-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\nhtml[data-macos-desktop] .macos-browser-tab-dot { width: 5px; height: 5px; flex: none; border-radius: 50%; background: #34c759; }\nhtml[data-macos-desktop] .macos-desktop.dark .macos-browser-tabs { background: rgba(38, 38, 40, 0.72); border-bottom-color: rgba(255, 255, 255, 0.08); }\nhtml[data-macos-desktop] .macos-desktop.dark .macos-browser-tab { color: rgba(255, 255, 255, 0.62); }\nhtml[data-macos-desktop] .macos-desktop.dark .macos-browser-tab.on { background: rgba(58, 58, 60, 0.92); color: rgba(255, 255, 255, 0.9); }\n\n/* ---------- floating assistant (\"精灵球\") ---------- */\n/* Closed, every app is ordinary software: the orb is the only sign the agent is around. */\n/* the orb must clear the window's own chrome: the window body is a stacking context in some apps,\n   so the orb lives directly on the window and floats above every layer of it */\n.macos-window .macos-orb-wrap { position: absolute; right: 16px; bottom: 16px; z-index: 2147482000;  display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }\n.macos-orb {\n  width: 34px; height: 34px; border-radius: 50%; border: 0.5px solid rgba(255, 255, 255, 0.55);\n  background: radial-gradient(circle at 32% 28%, #ffffff 0%, #e9ecf5 42%, #c3c9dd 100%);\n  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18), 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9);\n  display: flex; align-items: center; justify-content: center; cursor: pointer;\n  transition: transform 160ms ease, box-shadow 160ms ease;\n}\n.macos-orb:hover { transform: scale(1.08); box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22), 0 1px 2px rgba(0, 0, 0, 0.14); }\n.macos-orb.on { transform: scale(0.94); }\n.macos-orb-dot {\n  width: 14px; height: 14px; border-radius: 50%;\n  background: conic-gradient(from 210deg, #4c8dff, #7a5cff 35%, #ff5ea8 65%, #ffb34c 85%, #4c8dff 100%);\n  box-shadow: 0 0 8px rgba(122, 92, 255, 0.55), inset 0 0 4px rgba(255, 255, 255, 0.6);\n  animation: macos-orb-breathe 3.2s ease-in-out infinite;\n}\n@keyframes macos-orb-breathe { 0%, 100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }\n.macos-orb-panel {\n  width: 320px; max-height: 380px; display: flex; flex-direction: column;\n  border-radius: 14px; overflow: hidden;\n  background: var(--mac-card-bg, rgba(255, 255, 255, 0.82));\n  -webkit-backdrop-filter: var(--mac-card-blur, saturate(180%) blur(24px));\n  backdrop-filter: var(--mac-card-blur, saturate(180%) blur(24px));\n  border: 0.5px solid rgba(0, 0, 0, 0.12);\n  box-shadow: var(--mac-win-shadow, 0 18px 48px rgba(0, 0, 0, 0.24));\n}\n.macos-orb-head { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-bottom: 0.5px solid rgba(0, 0, 0, 0.08); }\n.macos-orb-title { font-size: 12.5px; font-weight: 600; color: #1d1d1f; }\n.macos-orb-close { border: 0; background: transparent; font-size: 15px; line-height: 1; color: rgba(0, 0, 0, 0.45); cursor: pointer; padding: 2px 4px; }\n.macos-orb-log { flex: 1; min-height: 60px; max-height: 240px; overflow: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 10px; }\n.macos-orb-hint { font-size: 12px; color: rgba(0, 0, 0, 0.45); line-height: 1.5; }\n.macos-orb-msg { display: flex; flex-direction: column; gap: 5px; }\n.macos-orb-you { align-self: flex-end; max-width: 92%; padding: 6px 9px; border-radius: 12px 12px 4px 12px; background: #0a84ff; color: #fff; font-size: 12.5px; line-height: 1.45; white-space: pre-wrap; }\n.macos-orb-reply { align-self: flex-start; max-width: 96%; padding: 7px 10px; border-radius: 12px 12px 12px 4px; background: rgba(0, 0, 0, 0.055); color: #1d1d1f; font-size: 12.5px; line-height: 1.5; white-space: pre-wrap; }\n.macos-orb-input { display: flex; gap: 6px; align-items: flex-end; padding: 8px 10px 10px; border-top: 0.5px solid rgba(0, 0, 0, 0.08); }\n.macos-orb-input textarea { flex: 1; resize: none; border: 0.5px solid rgba(0, 0, 0, 0.14); border-radius: 9px; padding: 6px 8px; font: inherit; font-size: 12.5px; background: rgba(255, 255, 255, 0.9); color: #1d1d1f; outline: none; }\n.macos-orb-input textarea:focus { border-color: #0a84ff; box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.18); }\n.macos-orb-send { border: 0; border-radius: 9px; background: #0a84ff; color: #fff; font-size: 12px; padding: 7px 11px; cursor: pointer; }\n.macos-orb-send:disabled { opacity: 0.55; cursor: default; }\n.macos-window.dark .macos-orb { background: radial-gradient(circle at 32% 28%, #f4f6fb 0%, #d7dcea 45%, #9aa2b8 100%); }\n.macos-window.dark .macos-orb-title, .macos-window.dark .macos-orb-reply { color: #f5f5f7; }\n.macos-window.dark .macos-orb-reply { background: rgba(255, 255, 255, 0.1); }\n.macos-window.dark .macos-orb-input textarea { background: rgba(255, 255, 255, 0.08); color: #f5f5f7; border-color: rgba(255, 255, 255, 0.18); }\n\n/* ---------- notes window ---------- */\n.macos-notes { display: flex; height: 100%; min-height: 0; background: #fbfbfd; }\n.macos-notes-side { width: 210px; flex: none; display: flex; flex-direction: column; gap: 2px; padding: 8px 6px; overflow: auto; border-right: 0.5px solid rgba(0, 0, 0, 0.08); background: rgba(246, 246, 249, 0.9); }\n.macos-notes-dir { font-size: 11px; color: rgba(0, 0, 0, 0.42); padding: 2px 8px 6px; cursor: pointer; }\n.macos-notes-item { text-align: left; border: 0; background: transparent; border-radius: 7px; padding: 6px 9px; font-size: 12.5px; color: #1d1d1f; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.macos-notes-item:hover { background: rgba(0, 0, 0, 0.055); }\n.macos-notes-item.on { background: rgba(10, 132, 255, 0.14); color: #0a5bd0; }\n.macos-notes-item.dir { color: rgba(0, 0, 0, 0.6); }\n.macos-notes-main { flex: 1; min-width: 0; display: flex; }\n.macos-notes-editor { flex: 1; border: 0; outline: none; resize: none; padding: 18px 22px; font: 13px/1.65 ui-monospace, SFMono-Regular, Menlo, monospace; color: #1d1d1f; background: #fff; }\n.macos-notes-empty { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 13px; color: rgba(0, 0, 0, 0.4); padding: 24px; text-align: center; }\n.macos-desktop.dark .macos-notes { background: #1e1e20; }\n.macos-desktop.dark .macos-notes-side { background: rgba(38, 38, 41, 0.9); border-color: rgba(255, 255, 255, 0.08); }\n.macos-desktop.dark .macos-notes-item { color: #f2f2f4; }\n.macos-desktop.dark .macos-notes-editor { background: #232326; color: #f2f2f4; }\n\n/* ---------- terminal window ---------- */\n.macos-term { display: flex; flex-direction: column; height: 100%; background: rgba(20, 20, 22, 0.96); color: #e8e8ea; font: 12.5px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; }\n.macos-term-log { flex: 1; min-height: 0; overflow: auto; padding: 12px 14px; white-space: pre-wrap; word-break: break-word; }\n.macos-term-line.cmd { color: #7ee787; }\n.macos-term-line.sys { color: rgba(232, 232, 234, 0.45); }\n.macos-term-line.err { color: #ff7b72; }\n.macos-term-input { display: flex; align-items: center; gap: 8px; padding: 8px 14px 12px; border-top: 0.5px solid rgba(255, 255, 255, 0.12); }\n.macos-term-prompt { color: #7ee787; flex: none; max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.macos-term-input input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; color: #f2f2f4; font: inherit; }\n\n/* ---------- Chrome-style browser window ---------- */\n.macos-browser-app { display: flex; flex-direction: column; height: 100%; min-height: 0; background: #dee1e6; }\n.macos-chrome-tabs { display: flex; align-items: flex-end; gap: 2px; padding: 7px 8px 0; overflow-x: auto; scrollbar-width: none; }\n.macos-chrome-tabs::-webkit-scrollbar { display: none; }\n.macos-chrome-tab { display: flex; align-items: center; gap: 7px; min-width: 120px; max-width: 220px; height: 32px; padding: 0 8px 0 10px; border-radius: 9px 9px 0 0; background: rgba(255, 255, 255, 0.45); font-size: 12px; color: #3c4043; cursor: default; user-select: none; }\n.macos-chrome-tab.on { background: #fff; box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.06), 1px 0 0 rgba(0, 0, 0, 0.06), -1px 0 0 rgba(0, 0, 0, 0.06); }\n.macos-chrome-favicon { width: 16px; height: 16px; flex: none; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; color: #fff; background: linear-gradient(160deg, #8ab4f8, #1a73e8); }\n.macos-chrome-tab-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.macos-chrome-tab-close { flex: none; width: 18px; height: 18px; border: 0; border-radius: 50%; background: transparent; color: #5f6368; font-size: 13px; line-height: 1; cursor: pointer; }\n.macos-chrome-tab-close:hover { background: rgba(0, 0, 0, 0.08); }\n.macos-chrome-newtab { flex: none; width: 26px; height: 26px; margin-bottom: 3px; border: 0; border-radius: 50%; background: transparent; color: #3c4043; font-size: 16px; cursor: pointer; }\n.macos-chrome-newtab:hover { background: rgba(0, 0, 0, 0.08); }\n.macos-chrome-bar { display: flex; align-items: center; gap: 4px; padding: 6px 8px; background: #fff; border-bottom: 0.5px solid rgba(0, 0, 0, 0.12); }\n.macos-chrome-btn { width: 28px; height: 28px; flex: none; border: 0; border-radius: 50%; background: transparent; color: #3c4043; font-size: 15px; line-height: 1; cursor: pointer; }\n.macos-chrome-btn:hover { background: rgba(0, 0, 0, 0.07); }\n.macos-chrome-omnibox { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 999px; background: #f1f3f4; }\n.macos-chrome-omnibox.editing { background: #fff; box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.5); }\n.macos-chrome-lock { font-size: 10px; color: #5f6368; flex: none; }\n.macos-chrome-omnibox input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; font-size: 12.5px; color: #202124; }\n.macos-chrome-omnibox-hint { flex: none; max-width: 30%; font-size: 11px; color: rgba(0, 0, 0, 0.45); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.macos-browser-view { position: relative; flex: 1; min-height: 0; overflow: hidden; background: #fff; outline: none; display: flex; align-items: center; justify-content: center; }\n.macos-browser-view.has-frame { align-items: flex-start; justify-content: flex-start; }\n.macos-browser-frame { display: block; width: 100%; height: 100%; object-fit: contain; object-position: top center; cursor: default; }\n.macos-browser-status { flex: none; height: 22px; display: flex; align-items: center; gap: 8px; padding: 0 10px; font-size: 11px; color: rgba(0, 0, 0, 0.5); background: #f1f3f4; border-top: 0.5px solid rgba(0, 0, 0, 0.1); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }\n.macos-desktop.dark .macos-browser-app { background: #26282c; }\n.macos-desktop.dark .macos-chrome-tab { background: rgba(255, 255, 255, 0.08); color: #c9ccd1; }\n.macos-desktop.dark .macos-chrome-tab.on { background: #35363a; color: #f1f3f4; }\n.macos-desktop.dark .macos-chrome-bar { background: #35363a; border-color: rgba(255, 255, 255, 0.1); }\n.macos-desktop.dark .macos-chrome-omnibox { background: #202124; }\n.macos-desktop.dark .macos-chrome-omnibox input { color: #e8eaed; }\n.macos-desktop.dark .macos-browser-status { background: #202124; color: rgba(255, 255, 255, 0.5); border-color: rgba(255, 255, 255, 0.1); }\n\n\n/* ---------- browser window: real ego viewport under Chrome chrome ---------- */\n.macos-browser-app { background: transparent !important; }\n.macos-browser-hole { position: relative; flex: 1; min-height: 0; pointer-events: auto; background: transparent; cursor: default; }\n.macos-browser-hole:focus { outline: none; }\n.macos-browser-hole > .macos-browser-frame { pointer-events: auto; }\n.macos-browser-hole > .macos-app-void { pointer-events: none; }\n.macos-window-body.hole .macos-browser-app > .macos-chrome-tabs,\n.macos-window-body.hole .macos-browser-app > .macos-chrome-bar,\n.macos-window-body.hole .macos-browser-app > .macos-browser-status { pointer-events: auto; }\n.macos-window-body.hole .macos-browser-status { margin-top: 0; }\n/* inside the window the panel is a bare viewport: its own toolbars belong to the desktop chrome */\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-head\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-pageinfo\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-tabs\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-statusline\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-actionline\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-livebadge\"] { display: none !important; }\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-root\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-body\"] {\n  height: 100% !important;\n  min-height: 0 !important;\n  overflow: hidden !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n  background: #fff !important;\n}\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-liveview\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-stage\"] {\n  flex: 1 1 auto !important;\n  height: 100% !important;\n  max-height: none !important;\n  overflow: hidden !important;\n  background: #fff !important;\n}\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"ego-side-livebox\"] {\n  flex: 1 1 auto !important;\n  height: 100% !important;\n  max-height: 100% !important;\n  aspect-ratio: auto !important;\n  background: #fff !important;\n  border-radius: 0 !important;\n}\nhtml[data-macos-desktop] [data-sidebar-right-panel] img[class*=\"ego-side-liveimg\"] {\n  width: 100% !important;\n  height: 100% !important;\n  max-height: none !important;\n  object-fit: contain !important;\n  object-position: top center !important;\n  border: 0 !important;\n}\n\n/* the floated panel is a bare viewport: its own header (tab chips) belongs to the desktop chrome */\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"_tabHostHeader\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"_tabStrip\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"_tabstrip\"],\nhtml[data-macos-desktop] [data-sidebar-right-panel] [class*=\"_stripTabs\"] { display: none !important; }\nhtml[data-macos-desktop] [data-sidebar-right-panel] { border-radius: 0 !important; }\n\n/* ================================================================= *\n *  访达 / 终端 / 设置 — the three apps rebuilt on real content\n * ================================================================= */\n\n/* wallpapers: three built-ins, chosen in 设置 */\nhtml[data-macos-desktop][data-macos-wallpaper=\"aurora\"] .macos-wallpaper {\n  background-image: linear-gradient(150deg, #04121f 0%, #0b3a52 28%, #17708a 55%, #5fc2b7 78%, #d6f4e6 100%) !important;\n}\nhtml[data-macos-desktop][data-macos-wallpaper=\"graphite\"] .macos-wallpaper {\n  background-image: linear-gradient(160deg, #23262c 0%, #3a3f47 38%, #5a616b 68%, #8d949e 100%) !important;\n}\nhtml[data-macos-desktop][data-macos-wallpaper=\"graphite\"] .macos-wallpaper-tint { opacity: .25 !important; }\n\n/* dock scaling from 设置 */\nhtml[data-macos-desktop] .macos-dock { transform: scale(var(--mac-dock-scale, 1)); transform-origin: bottom center; }\n\n/* ---- 访达 ---- */\nhtml[data-macos-desktop] .macos-finder-side { width: 200px; font: 13px -apple-system, BlinkMacSystemFont, \"PingFang SC\", sans-serif; background: rgba(244, 245, 247, .82); -webkit-backdrop-filter: var(--mac-card-blur); backdrop-filter: var(--mac-card-blur); }\nhtml[data-macos-desktop] .macos-finder-side-title { font-size: 11px; font-weight: 600; color: #86868b; padding: 10px 10px 5px; }\nhtml[data-macos-desktop] .macos-finder-side-row {\n  display: flex; align-items: center; gap: 8px; width: 100%; height: 28px; padding: 0 8px; border: 0; border-radius: 6px;\n  background: transparent; color: inherit; font: inherit; font-size: 12.5px; text-align: left; cursor: default;\n}\nhtml[data-macos-desktop] .macos-finder-side-row:hover { background: rgba(0, 0, 0, .05); }\nhtml[data-macos-desktop] .macos-finder-side-row.on { background: rgba(0, 122, 255, .16); }\nhtml[data-macos-desktop] .macos-finder-side-ic { display: flex; width: 16px; height: 16px; }\nhtml[data-macos-desktop] .macos-finder-side-ic svg { width: 16px; height: 16px; }\n\n/* --- Finder: the titlebar IS the toolbar, exactly like macOS --- */\nhtml[data-macos-desktop] .macos-window.app-finder .macos-titlebar { height: 52px; padding-left: 20px; gap: 14px; }\nhtml[data-macos-desktop] .macos-titlebar-head { display: flex; align-items: center; gap: 2px; margin-left: 6px; }\nhtml[data-macos-desktop] .macos-finder-nav { display: flex; align-items: center; gap: 2px; }\nhtml[data-macos-desktop] .macos-finder-tool {\n  display: flex; align-items: center; justify-content: center; width: 28px; height: 26px;\n  border: 0; border-radius: 7px; background: transparent; color: #4a4a4f; cursor: default; padding: 0;\n}\nhtml[data-macos-desktop] .macos-finder-tool:hover:not(:disabled) { background: rgba(0, 0, 0, .06); }\nhtml[data-macos-desktop] .macos-finder-tool:active:not(:disabled) { background: rgba(0, 0, 0, .12); }\nhtml[data-macos-desktop] .macos-finder-tool:disabled { opacity: .28; }\nhtml[data-macos-desktop] .macos-finder-glyph { width: 16px; height: 16px; }\nhtml[data-macos-desktop] .macos-finder-actions { display: flex; align-items: center; gap: 10px; }\nhtml[data-macos-desktop] .macos-finder-seg { display: inline-flex; padding: 2px; gap: 1px; border-radius: 8px; background: rgba(0, 0, 0, .055); }\nhtml[data-macos-desktop] .macos-finder-seg-btn {\n  display: flex; align-items: center; justify-content: center; width: 30px; height: 22px; padding: 0;\n  border: 0; border-radius: 6px; background: transparent; color: #55555a; cursor: default;\n}\nhtml[data-macos-desktop] .macos-finder-seg-btn.on { background: #fff; color: #1d1d1f; box-shadow: 0 1px 2px rgba(0, 0, 0, .16); }\nhtml[data-macos-desktop] .macos-finder-searchwrap { position: relative; display: flex; align-items: center; }\nhtml[data-macos-desktop] .macos-finder-searchic { position: absolute; left: 7px; width: 12px; height: 12px; color: #86868b; pointer-events: none; }\nhtml[data-macos-desktop] .macos-finder-search {\n  width: 150px; height: 24px; padding: 0 8px 0 24px; border-radius: 7px;\n  border: .5px solid rgba(0, 0, 0, .16); background: #fff; color: #1d1d1f;\n  font: 12.5px -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"PingFang SC\", sans-serif; outline: none;\n}\nhtml[data-macos-desktop] .macos-finder-search:focus { border-color: rgba(0, 122, 255, .7); box-shadow: 0 0 0 3px rgba(0, 122, 255, .18); }\nhtml[data-macos-desktop] .macos-finder-crumbbar {\n  display: flex; align-items: center; gap: 1px; height: 24px; padding: 0 14px;\n  border-bottom: .5px solid rgba(0, 0, 0, .08); background: rgba(250, 250, 252, .72); overflow: hidden;\n  font: 11.5px -apple-system, BlinkMacSystemFont, \"PingFang SC\", sans-serif;\n}\nhtml[data-macos-desktop] .macos-finder-crumb { display: inline-flex; align-items: center; white-space: nowrap; }\nhtml[data-macos-desktop] .macos-finder-crumb-btn {\n  border: 0; background: transparent; color: #5c5c61; font: inherit; padding: 1px 4px; border-radius: 5px; cursor: default;\n}\nhtml[data-macos-desktop] .macos-finder-crumb-btn:hover { background: rgba(0, 0, 0, .06); color: #1d1d1f; }\nhtml[data-macos-desktop] .macos-finder-sep { color: #c0c0c5; font-size: 10px; margin: 0 1px; }\nhtml[data-macos-desktop] .macos-finder-note { padding: 6px 12px; font-size: 12px; color: #a35b00; background: rgba(255, 196, 92, .16); }\nhtml[data-macos-desktop] .macos-finder-body { flex: 1; min-height: 0; display: flex; background: #fff; }\nhtml[data-macos-desktop] .macos-finder-search, html[data-macos-desktop] .macos-finder-crumb-btn { outline: none; }\n\nhtml[data-macos-desktop] .macos-finder-grid {\n  flex: 1; min-width: 0; overflow: auto; padding: 16px 14px; display: grid; align-content: start;\n  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 10px 6px;\n}\nhtml[data-macos-desktop] .macos-finder-item {\n  display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 8px 4px 6px;\n  font: 12px -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"PingFang SC\", sans-serif;\n  border: 0; border-radius: 8px; background: transparent; color: inherit; font: inherit; cursor: default;\n}\nhtml[data-macos-desktop] .macos-finder-item:hover { background: rgba(0, 0, 0, .04); }\nhtml[data-macos-desktop] .macos-finder-item.on { background: rgba(0, 122, 255, .14); }\nhtml[data-macos-desktop] .macos-finder-ic { display: flex; align-items: center; justify-content: center; width: 56px; height: 48px; }\nhtml[data-macos-desktop] .macos-finder-folder { display: flex; }\nhtml[data-macos-desktop] .macos-finder-folder svg { width: 52px; height: 44px; }\nhtml[data-macos-desktop] .macos-finder-folder.sm svg { width: 18px; height: 16px; }\nhtml[data-macos-desktop] .macos-finder-ext {\n  display: flex; align-items: center; justify-content: center; width: 42px; height: 46px; border-radius: 6px;\n  background: linear-gradient(#fdfdfe, #eef0f4); border: 1px solid rgba(0, 0, 0, .12);\n  font-size: 9px; font-weight: 700; letter-spacing: .02em; color: #6b7280;\n}\nhtml[data-macos-desktop] .macos-finder-ext.sm { width: 18px; height: 20px; font-size: 7px; }\nhtml[data-macos-desktop] .macos-finder-name {\n  max-width: 100%; font-size: 12px; line-height: 1.25; text-align: center; color: #1d1d1f;\n  overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; word-break: break-all;\n}\n\nhtml[data-macos-desktop] .macos-finder-list { flex: 1; min-width: 0; overflow: auto; }\nhtml[data-macos-desktop] .macos-finder-row {\n  display: grid; grid-template-columns: minmax(0, 1fr) 92px 138px; align-items: center; gap: 10px;\n  width: 100%; height: 26px; padding: 0 12px; border: 0; background: transparent; color: #1d1d1f;\n  font: 12.5px -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"PingFang SC\", sans-serif; text-align: left; cursor: default;\n}\nhtml[data-macos-desktop] .macos-finder-row > span:nth-child(2),\nhtml[data-macos-desktop] .macos-finder-row > span:nth-child(3) { text-align: right; color: #6e6e73; font-size: 12px; }\nhtml[data-macos-desktop] .macos-finder-row.head { color: #86868b; font-size: 11px; border-bottom: .5px solid rgba(0, 0, 0, .1); background: rgba(250, 250, 252, .95); }\nhtml[data-macos-desktop] .macos-finder-row:not(.head):nth-child(even) { background: rgba(0, 0, 0, .018); }\nhtml[data-macos-desktop] .macos-finder-row.on { background: rgba(0, 122, 255, .16) !important; }\nhtml[data-macos-desktop] .macos-finder-row-name { display: flex; align-items: center; gap: 7px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\nhtml[data-macos-desktop] .macos-finder-row-ic { display: flex; align-items: center; }\n\nhtml[data-macos-desktop] .macos-finder-preview {\n  width: 340px; flex: none; border-left: 1px solid rgba(0, 0, 0, .08); display: flex; flex-direction: column;\n  background: #fbfbfd; min-height: 0;\n}\nhtml[data-macos-desktop] .macos-finder-preview-head {\n  display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px;\n  font-size: 12px; border-bottom: 1px solid rgba(0, 0, 0, .07);\n}\nhtml[data-macos-desktop] .macos-finder-preview-body {\n  flex: 1; min-height: 0; overflow: auto; margin: 0; padding: 10px 12px;\n  font: 11.5px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; word-break: break-word; color: #333;\n}\nhtml[data-macos-desktop] .macos-finder-status {\n  display: flex; align-items: center; justify-content: center; gap: 14px; height: 24px; padding: 0 12px;\n  font: 11px -apple-system, BlinkMacSystemFont, \"PingFang SC\", sans-serif; color: #86868b;\n  border-top: 1px solid rgba(0, 0, 0, .07); background: rgba(250, 250, 252, .92);\n}\nhtml[data-macos-desktop] .macos-finder-status-path { margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n\n/* ---- 终端 ---- */\nhtml[data-macos-desktop] .macos-term-screen {\n  flex: 1; min-height: 0; overflow: auto; padding: 12px 14px; background: #16161a; color: #e9e9ec;\n  outline: none; cursor: text;\n}\nhtml[data-macos-desktop] .macos-term-text {\n  margin: 0; font: 12.5px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; word-break: break-word;\n}\nhtml[data-macos-desktop] .macos-term-foot {\n  display: flex; align-items: center; gap: 10px; padding: 6px 12px; background: #101014; color: #9a9aa2;\n  border-top: 1px solid #2a2a30; font-size: 11px;\n}\nhtml[data-macos-desktop] .macos-term-screen:focus { box-shadow: inset 0 0 0 1px rgba(120, 170, 255, .35); }\n\n/* ---- 设置 ---- */\nhtml[data-macos-desktop] .macos-settings { flex: 1; display: flex; min-height: 0; background: #fff; }\nhtml[data-macos-desktop] .macos-settings-side {\n  width: 190px; flex: none; padding: 10px 8px; background: rgba(244, 245, 247, .85);\n  border-right: 1px solid rgba(0, 0, 0, .08); overflow: auto;\n}\nhtml[data-macos-desktop] .macos-settings-side-row { padding: 6px 10px; border-radius: 7px; font-size: 12.5px; color: #3a3a3f; }\nhtml[data-macos-desktop] .macos-settings-side-row.on { background: rgba(0, 122, 255, .16); color: #0a58c8; }\nhtml[data-macos-desktop] .macos-settings-main { flex: 1; min-width: 0; overflow: auto; padding: 16px 20px 24px; }\nhtml[data-macos-desktop] .macos-settings-section { margin: 0 0 18px; }\nhtml[data-macos-desktop] .macos-settings-section h3 { margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #6f6f76; }\nhtml[data-macos-desktop] .macos-seg { display: inline-flex; padding: 2px; gap: 2px; border-radius: 8px; background: rgba(0, 0, 0, .06); }\nhtml[data-macos-desktop] .macos-seg-btn {\n  border: 0; background: transparent; color: #3a3a3f; font: inherit; font-size: 12px; padding: 4px 12px; border-radius: 6px; cursor: default;\n}\nhtml[data-macos-desktop] .macos-seg-btn.on { background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, .14); }\nhtml[data-macos-desktop] .macos-range { width: 220px; accent-color: #0a84ff; }\nhtml[data-macos-desktop] .macos-input {\n  width: 280px; height: 26px; padding: 0 9px; border-radius: 7px; border: 1px solid rgba(0, 0, 0, .14);\n  background: #fff; color: inherit; font: inherit; font-size: 12.5px;\n}\nhtml[data-macos-desktop] .macos-about { display: flex; flex-direction: column; gap: 3px; font-size: 12.5px; color: #3a3a3f; }\nhtml[data-macos-desktop] .macos-about-name { font-size: 15px; font-weight: 600; color: #1c1c1e; margin-bottom: 4px; }\nhtml[data-macos-desktop] .macos-about-line { color: #6a6a70; font-size: 12px; }\nhtml[data-macos-desktop] .macos-settings-note { font-size: 12px; color: #8a8a8f; line-height: 1.6; }\n\n.macos-desktop.dark html[data-macos-desktop] .macos-finder-body,\nhtml[data-macos-desktop] .macos-desktop.dark .macos-finder-body { background: #1c1c1f; }\n\n/* ---- macOS window chrome metrics ----\n   28px titlebar, 12px traffic lights with 8px gaps and 20px leading, glyphs on hover of the group,\n   right-side controls on the same optical line as the lights. */\nhtml[data-macos-desktop] .macos-titlebar {\n  position: relative; display: flex; align-items: center; gap: 8px;\n  height: 38px; padding: 0 12px 0 20px; box-sizing: border-box;\n}\nhtml[data-macos-desktop] .macos-lights { display: flex; align-items: center; gap: 8px; margin-right: 4px; }\nhtml[data-macos-desktop] .macos-light {\n  width: 12px; height: 12px; flex: none; padding: 0; border: 0; border-radius: 50%;\n  display: flex; align-items: center; justify-content: center; overflow: hidden;\n  box-shadow: inset 0 0 0 .5px rgba(0, 0, 0, .14); cursor: default;\n}\nhtml[data-macos-desktop] .macos-light.close { background: #ff5f57; }\nhtml[data-macos-desktop] .macos-light.min { background: #febc2e; }\nhtml[data-macos-desktop] .macos-light.zoom { background: #28c840; }\nhtml[data-macos-desktop] .macos-window.blurred .macos-light { background: #d3d3d6; box-shadow: inset 0 0 0 .5px rgba(0, 0, 0, .1); }\nhtml[data-macos-desktop] .macos-light-glyph { width: 12px; height: 12px; opacity: 0; color: rgba(0, 0, 0, .62); }\nhtml[data-macos-desktop] .macos-lights:hover .macos-light-glyph,\nhtml[data-macos-desktop] .macos-lights.on .macos-light-glyph { opacity: 0; }\nhtml[data-macos-desktop] .macos-lights:hover .macos-light-glyph { opacity: 1; }\nhtml[data-macos-desktop] .macos-title {\n  position: absolute; left: 50%; transform: translateX(-50%); max-width: 46%;\n  font: 600 13px -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"PingFang SC\", sans-serif;\n  color: #1d1d1f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none;\n}\nhtml[data-macos-desktop] .macos-window.blurred .macos-title { color: #9a9aa0; }\nhtml[data-macos-desktop] .macos-titlebar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; min-height: 22px; }\nhtml[data-macos-desktop] .macos-window.app-finder .macos-title { max-width: 36%; }\nhtml[data-macos-desktop] .macos-window.app-finder .macos-titlebar-right { gap: 10px; }\n\n/* ---------- about this Mac (settings), macOS Sonoma proportions ---------- */\n.macos-about { padding: 6px 0 2px; }\n.macos-about-mark {\n  width: 56px; height: 56px; margin-bottom: 10px; border-radius: 12px; overflow: hidden;\n  box-shadow: 0 1px 2px rgba(0,0,0,.14), 0 6px 16px rgba(0,0,0,.10);\n}\n.macos-about-mark svg { width: 100%; height: 100%; display: block; }\n.macos-about-name {\n  font-size: 20px; font-weight: 600; letter-spacing: -0.01em;\n  color: var(--mac-label); line-height: 1.2;\n}\n.macos-about-sub { font-size: 11px; color: var(--mac-label-2); margin-top: 2px; }\n.macos-about-spec {\n  margin: 14px 0 0; display: grid; gap: 6px; max-width: 420px;\n}\n.macos-about-spec-row {\n  display: grid; grid-template-columns: 72px 1fr; align-items: baseline; gap: 10px;\n  font-size: 13px;\n}\n.macos-about-spec-row dt { color: var(--mac-label-2); font-size: 11px; text-align: right; }\n.macos-about-spec-row dd { margin: 0; color: var(--mac-label); font-variant-numeric: tabular-nums; }\n.macos-about-actions { margin-top: 16px; display: flex; gap: 8px; }\n.macos-about-report {\n  margin-top: 12px; padding: 12px 14px; border-radius: 10px;\n  background: rgba(120,120,128,.08); display: grid; gap: 6px;\n  font-size: 11px; max-width: 560px;\n}\n.macos-about-report-row { display: grid; grid-template-columns: 68px 1fr; gap: 10px; align-items: baseline; }\n.macos-about-report-row span { color: var(--mac-label-2); text-align: right; }\n.macos-about-report-row code {\n  font-family: var(--mac-mono); color: var(--mac-label); word-break: break-all;\n}\n.macos-desktop.dark .macos-about-report { background: rgba(255,255,255,.07); }\n\n/* ---------- terminal block cursor ---------- */\n.macos-term-text { white-space: pre-wrap; word-break: break-word; }\n.macos-term-cursor {\n  display: inline-block; width: 7.4px; height: 15px; margin-left: 1px;\n  vertical-align: -2px; background: rgba(255,255,255,.86);\n  animation: macos-blink 1.06s steps(1, end) infinite;\n}\n@keyframes macos-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }\n.macos-finder-status-path { display: none; }\n.macos-finder-status { justify-content: center; }\n\n/* settings sidebar rows are buttons: strip the UA chrome so they read as macOS list rows */\n.macos-settings-side-row {\n  appearance: none; -webkit-appearance: none; border: 0; margin: 0; width: 100%;\n  background: transparent; font: inherit; color: var(--mac-label);\n  text-align: left; padding: 5px 10px; border-radius: 6px; cursor: default;\n}\n.macos-settings-side-row:hover { background: rgba(120,120,128,.12); }\n.macos-settings-side-row.on { background: #0a84ff; color: #fff; }\n.macos-desktop.dark .macos-settings-side-row.on { background: #0a84ff; }\n.macos-about-actions .macos-btn {\n  flex: 0 0 auto; appearance: none; -webkit-appearance: none; border: 0;\n  padding: 5px 14px; border-radius: 6px; font: inherit; font-size: 12px;\n  background: rgba(120,120,128,.16); color: var(--mac-label); cursor: default;\n}\n.macos-about-actions .macos-btn:hover { background: rgba(120,120,128,.24); }\n\n/* ---------- settings: dock order list (drag to reorder) ---------- */\n.macos-dock-list { display: grid; gap: 4px; max-width: 420px; margin-top: 10px; }\n.macos-dock-list .macos-btn { width: auto; justify-self: start; appearance: none; -webkit-appearance: none;\n  border: 0; padding: 5px 14px; border-radius: 6px; font: inherit; font-size: 12px;\n  background: rgba(120,120,128,.16); color: var(--mac-label); cursor: default; }\n.macos-dock-list .macos-btn:hover { background: rgba(120,120,128,.24); }\n.macos-dock-row {\n  display: grid; grid-template-columns: 16px 26px 1fr auto; align-items: center; gap: 10px;\n  padding: 6px 10px; border-radius: 8px; background: rgba(120,120,128,.08);\n  font-size: 13px; color: var(--mac-label); cursor: grab;\n  transition: background .12s ease, transform .12s ease;\n}\n.macos-dock-row:hover { background: rgba(120,120,128,.14); }\n.macos-dock-row.dragging { opacity: .45; }\n.macos-dock-row.over { background: rgba(10,132,255,.14); box-shadow: inset 0 0 0 1px rgba(10,132,255,.5); }\n.macos-dock-row-grip { color: var(--mac-label-2); font-size: 11px; letter-spacing: -2px; }\n.macos-dock-row-icon { width: 26px; height: 26px; border-radius: 6px; overflow: hidden; display: block; }\n.macos-dock-row-icon svg { width: 100%; height: 100%; display: block; }\n.macos-dock-row-slot { color: var(--mac-label-2); font-size: 11px; font-variant-numeric: tabular-nums; }\n.macos-desktop.dark .macos-dock-row { background: rgba(255,255,255,.08); }\n.macos-desktop.dark .macos-dock-row:hover { background: rgba(255,255,255,.14); }\n\n/* ---------- office window: Univer viewer embedded next to its file list ---------- */\nhtml[data-macos-desktop] .macos-office-wrap { flex: 1; display: flex; min-height: 0; }\nhtml[data-macos-desktop] .macos-office-side {\n  width: 196px; flex: 0 0 196px; border-right: 0.5px solid rgba(0,0,0,.1);\n  background: rgba(246,246,248,.92); overflow: auto; padding: 8px 6px;\n}\nhtml[data-macos-desktop] .macos-office-side .macos-finder-side-row {\n  display: flex; align-items: center; gap: 8px; width: 100%; border: 0; background: transparent;\n  font: inherit; font-size: 12.5px; color: #1d1d1f; text-align: left; padding: 5px 8px; border-radius: 6px; cursor: default;\n}\nhtml[data-macos-desktop] .macos-office-side .macos-finder-side-row:hover { background: rgba(120,120,128,.12); }\nhtml[data-macos-desktop] .macos-office-side .macos-finder-side-row.on { background: #0a84ff; color: #fff; }\nhtml[data-macos-desktop] .macos-office-ext {\n  flex: 0 0 auto; font-size: 8px; font-weight: 700; letter-spacing: .04em;\n  padding: 1px 3px; border-radius: 3px; background: rgba(120,120,128,.18); color: inherit;\n}\nhtml[data-macos-desktop] .macos-office-main { flex: 1; min-width: 0; display: flex; background: #fff; }\nhtml[data-macos-desktop] .macos-office-frame { width: 100%; height: 100%; border: 0; display: block; background: #fff; flex: 1; }\nhtml[data-macos-desktop] .macos-desktop.dark .macos-office-side { background: rgba(40,40,44,.92); }\n\n/* ---------- notes window: Obsidian-like vault / list / editor ---------- */\nhtml[data-macos-desktop] .macos-notes { display: flex; flex: 1; min-height: 0; background: #fff; }\nhtml[data-macos-desktop] .macos-notes-side {\n  width: 232px; flex: 0 0 232px; border-right: 0.5px solid rgba(0,0,0,.1);\n  background: rgba(246,246,248,.94); overflow: auto; padding: 8px 8px 12px;\n}\nhtml[data-macos-desktop] .macos-notes-vault {\n  display: flex; align-items: center; gap: 7px; padding: 6px 8px;\n  font-size: 13px; font-weight: 600; color: var(--mac-label);\n}\nhtml[data-macos-desktop] .macos-notes-vault-ic {\n  width: 17px; height: 17px; flex: 0 0 17px; border-radius: 4px; overflow: hidden; display: block;\n}\nhtml[data-macos-desktop] .macos-notes-vault-ic svg { width: 100%; height: 100%; display: block; }\nhtml[data-macos-desktop] .macos-notes-item {\n  display: flex; align-items: baseline; justify-content: space-between; gap: 8px;\n  width: 100%; border: 0; background: transparent; font: inherit; font-size: 12.5px;\n  color: var(--mac-label); text-align: left; padding: 6px 9px; border-radius: 7px; cursor: default;\n}\nhtml[data-macos-desktop] .macos-notes-item:hover { background: rgba(120,120,128,.12); }\nhtml[data-macos-desktop] .macos-notes-item.on { background: #0a84ff; color: #fff; }\nhtml[data-macos-desktop] .macos-notes-item-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\nhtml[data-macos-desktop] .macos-notes-item-date { flex: 0 0 auto; font-size: 10px; opacity: .62; font-variant-numeric: tabular-nums; }\nhtml[data-macos-desktop] .macos-notes-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }\nhtml[data-macos-desktop] .macos-notes-doc { flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 18px 26px 10px; }\nhtml[data-macos-desktop] .macos-notes-doc-head {\n  display: grid; grid-template-columns: 1fr auto; grid-template-areas: 'title save' 'meta save';\n  align-items: center; gap: 2px 14px; padding-bottom: 12px; border-bottom: 0.5px solid rgba(0,0,0,.09);\n  margin-bottom: 14px;\n}\nhtml[data-macos-desktop] .macos-notes-title { grid-area: title; font-size: 21px; font-weight: 600; letter-spacing: -0.01em; color: var(--mac-label); }\nhtml[data-macos-desktop] .macos-notes-meta { grid-area: meta; font-size: 11px; color: var(--mac-label-2); font-variant-numeric: tabular-nums; }\nhtml[data-macos-desktop] .macos-notes-doc-head .macos-btn { grid-area: save; }\nhtml[data-macos-desktop] .macos-btn {\n  appearance: none; -webkit-appearance: none; border: 0; font: inherit; font-size: 12px;\n  padding: 5px 14px; border-radius: 6px; background: rgba(120,120,128,.16); color: var(--mac-label); cursor: default;\n}\nhtml[data-macos-desktop] .macos-btn:hover { background: rgba(120,120,128,.24); }\nhtml[data-macos-desktop] .macos-btn:disabled { opacity: .45; }\nhtml[data-macos-desktop] .macos-notes-editor {\n  flex: 1; min-height: 0; width: 100%; resize: none; border: 0; outline: none; background: transparent;\n  font-family: var(--mac-mono); font-size: 13px; line-height: 1.72; color: var(--mac-label);\n}\nhtml[data-macos-desktop] .macos-notes-preview { flex: 1; min-height: 0; overflow: auto; }\nhtml[data-macos-desktop] .macos-notes-md-inner { max-width: 720px; font-size: 13.5px; line-height: 1.75; color: var(--mac-label); }\nhtml[data-macos-desktop] .macos-notes-md-inner h1 { font-size: 22px; font-weight: 600; margin: 4px 0 10px; }\nhtml[data-macos-desktop] .macos-notes-md-inner h2 { font-size: 17px; font-weight: 600; margin: 18px 0 8px; }\nhtml[data-macos-desktop] .macos-notes-md-inner h3 { font-size: 14px; font-weight: 600; margin: 14px 0 6px; }\nhtml[data-macos-desktop] .macos-notes-md-inner p { margin: 0 0 10px; }\nhtml[data-macos-desktop] .macos-notes-md-inner ul, html[data-macos-desktop] .macos-notes-md-inner ol { margin: 0 0 10px; padding-left: 22px; }\nhtml[data-macos-desktop] .macos-notes-md-inner li { margin: 2px 0; }\nhtml[data-macos-desktop] .macos-notes-md-inner blockquote {\n  margin: 0 0 10px; padding: 6px 12px; border-left: 3px solid rgba(10,132,255,.5);\n  background: rgba(120,120,128,.08); border-radius: 0 6px 6px 0; color: var(--mac-label-2);\n}\nhtml[data-macos-desktop] .macos-notes-md-inner code {\n  font-family: var(--mac-mono); font-size: 12px; background: rgba(120,120,128,.14);\n  padding: 1px 4px; border-radius: 4px;\n}\nhtml[data-macos-desktop] .macos-notes-md-inner table { border-collapse: collapse; margin: 0 0 12px; font-size: 12.5px; }\nhtml[data-macos-desktop] .macos-notes-md-inner th, html[data-macos-desktop] .macos-notes-md-inner td {\n  border: 0.5px solid rgba(0,0,0,.14); padding: 5px 10px; text-align: left;\n}\nhtml[data-macos-desktop] .macos-notes-md-inner th { background: rgba(120,120,128,.1); font-weight: 600; }\nhtml[data-macos-desktop] .macos-md-check {\n  display: inline-block; width: 11px; height: 11px; margin-right: 6px; border-radius: 3px;\n  border: 1px solid rgba(0,0,0,.28); vertical-align: -1px;\n}\nhtml[data-macos-desktop] .macos-md-check.on { background: #0a84ff; border-color: #0a84ff; }\nhtml[data-macos-desktop] .macos-notes-tags {\n  display: flex; gap: 6px; flex-wrap: wrap; padding-top: 10px; border-top: 0.5px solid rgba(0,0,0,.09); margin-top: 10px;\n}\nhtml[data-macos-desktop] .macos-notes-tag {\n  font-size: 11px; padding: 2px 8px; border-radius: 999px;\n  background: rgba(10,132,255,.12); color: #0a5bd6;\n}\nhtml[data-macos-desktop] .macos-empty-title { font-size: 15px; font-weight: 600; color: var(--mac-label); margin-top: 10px; }\nhtml[data-macos-desktop] .macos-empty-sub { font-size: 12px; color: var(--mac-label-2); margin-top: 6px; max-width: 320px; text-align: center; }\nhtml[data-macos-desktop] .macos-notes-empty {\n  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;\n}\nhtml[data-macos-desktop] .macos-notes-empty .macos-icon-i { width: 64px; height: 64px; }\nhtml[data-macos-desktop] .macos-seg.sm .macos-seg-btn { padding: 2px 9px; font-size: 11.5px; }\nhtml[data-macos-desktop] .macos-input.sm { width: 168px; height: 24px; font-size: 12px; padding: 0 9px; }\nhtml[data-macos-desktop] .macos-tb-note { font-size: 11px; color: var(--mac-label-2); }\nhtml[data-macos-desktop] .macos-desktop.dark .macos-notes-side { background: rgba(40,40,44,.94); }\nhtml[data-macos-desktop] .macos-desktop.dark .macos-notes { background: #1e1e21; }\n\n/* ---------- spreadsheet view inside the Office window ---------- */\nhtml[data-macos-desktop] .macos-office-sheet-wrap { flex: 1; display: flex; flex-direction: column; min-width: 0; background: #fff; }\nhtml[data-macos-desktop] .macos-sheet-toolbar {\n  display: flex; align-items: center; gap: 10px; padding: 6px 12px;\n  border-bottom: 0.5px solid rgba(0,0,0,.1); font-size: 12px; color: var(--mac-label);\n}\nhtml[data-macos-desktop] .macos-sheet-toolbar .macos-btn { margin-left: auto; }\nhtml[data-macos-desktop] .macos-sheet-name { font-weight: 600; }\nhtml[data-macos-desktop] .macos-sheet { flex: 1; display: flex; flex-direction: column; min-height: 0; }\nhtml[data-macos-desktop] .macos-sheet-formula {\n  display: flex; align-items: center; gap: 10px; padding: 4px 10px; font-size: 12px;\n  border-bottom: 0.5px solid rgba(0,0,0,.1); color: var(--mac-label);\n}\nhtml[data-macos-desktop] .macos-sheet-cellref {\n  min-width: 44px; font-variant-numeric: tabular-nums; color: var(--mac-label-2);\n}\nhtml[data-macos-desktop] .macos-sheet-fx { font-style: italic; color: var(--mac-label-2); }\nhtml[data-macos-desktop] .macos-sheet-value { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\nhtml[data-macos-desktop] .macos-sheet-grid { flex: 1; overflow: auto; font-size: 12.5px; }\nhtml[data-macos-desktop] .macos-sheet-row { display: grid; }\nhtml[data-macos-desktop] .macos-sheet-row.head { position: sticky; top: 0; z-index: 2; background: #f6f6f8; }\nhtml[data-macos-desktop] .macos-sheet-col, html[data-macos-desktop] .macos-sheet-corner {\n  padding: 4px 8px; font-size: 11px; color: var(--mac-label-2); text-align: center;\n  border-right: 0.5px solid rgba(0,0,0,.1); border-bottom: 0.5px solid rgba(0,0,0,.1);\n}\nhtml[data-macos-desktop] .macos-sheet-col.on { background: rgba(10,132,255,.14); color: #0a5bd6; }\nhtml[data-macos-desktop] .macos-sheet-rownum {\n  padding: 5px 8px; font-size: 11px; color: var(--mac-label-2); text-align: right;\n  border-right: 0.5px solid rgba(0,0,0,.1); border-bottom: 0.5px solid rgba(0,0,0,.1); background: #fafafb;\n}\nhtml[data-macos-desktop] .macos-sheet-cell {\n  padding: 5px 9px; border-right: 0.5px solid rgba(0,0,0,.07); border-bottom: 0.5px solid rgba(0,0,0,.07);\n  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--mac-label); cursor: cell;\n}\nhtml[data-macos-desktop] .macos-sheet-cell.num { text-align: right; font-variant-numeric: tabular-nums; }\nhtml[data-macos-desktop] .macos-sheet-cell.label { font-weight: 500; }\nhtml[data-macos-desktop] .macos-sheet-cell.sel { outline: 2px solid #0a84ff; outline-offset: -2px; background: rgba(10,132,255,.06); }\nhtml[data-macos-desktop] .macos-sheet-row.total .macos-sheet-cell { background: #f4f6ff; font-weight: 600; }\nhtml[data-macos-desktop] .macos-sheet-status {\n  display: flex; justify-content: space-between; padding: 4px 12px; font-size: 11px;\n  color: var(--mac-label-2); border-top: 0.5px solid rgba(0,0,0,.1); background: #fafafb;\n}\nhtml[data-macos-desktop] .macos-desktop.dark .macos-sheet-grid,\nhtml[data-macos-desktop] .macos-desktop.dark .macos-office-sheet-wrap { background: #1e1e21; }\nhtml[data-macos-desktop] .macos-desktop.dark .macos-sheet-row.head { background: #26262a; }\n\n/* the sheet must own the full window width: flex items default to min-content here */\nhtml[data-macos-desktop] .macos-office-sheet-wrap > .macos-sheet { flex: 1 1 auto; min-width: 0; width: 100%; }\nhtml[data-macos-desktop] .macos-sheet-grid { width: 100%; min-width: 0; }\nhtml[data-macos-desktop] .macos-sheet-row { width: 100%; }\n\n/* ---------- presentation view in the Office window ---------- */\nhtml[data-macos-desktop] .macos-deck { flex: 1; display: flex; min-height: 0; background: #f2f2f5; }\nhtml[data-macos-desktop] .macos-deck-rail {\n  width: 176px; flex: 0 0 176px; overflow: auto; padding: 10px 8px; display: flex; flex-direction: column; gap: 6px;\n  border-right: 0.5px solid rgba(0,0,0,.1); background: rgba(246,246,248,.94);\n}\nhtml[data-macos-desktop] .macos-deck-thumb {\n  display: flex; gap: 7px; align-items: flex-start; text-align: left; border: 0; background: #fff;\n  border-radius: 6px; padding: 6px 8px; font: inherit; font-size: 11px; color: var(--mac-label);\n  box-shadow: 0 1px 2px rgba(0,0,0,.08); cursor: default; min-height: 52px;\n}\nhtml[data-macos-desktop] .macos-deck-thumb.on { outline: 2px solid #0a84ff; }\nhtml[data-macos-desktop] .macos-deck-thumb-no { color: var(--mac-label-2); font-variant-numeric: tabular-nums; }\nhtml[data-macos-desktop] .macos-deck-thumb-t { line-height: 1.35; }\nhtml[data-macos-desktop] .macos-deck-stage { flex: 1; display: flex; flex-direction: column; min-width: 0; padding: 18px 22px 10px; }\nhtml[data-macos-desktop] .macos-deck-slide {\n  flex: 1; background: #fff; border-radius: 8px; box-shadow: 0 6px 22px rgba(0,0,0,.12);\n  padding: 44px 52px; display: flex; flex-direction: column; min-height: 0;\n}\nhtml[data-macos-desktop] .macos-deck-title { font-size: 30px; font-weight: 600; letter-spacing: -0.015em; color: #1d1d1f; }\nhtml[data-macos-desktop] .macos-deck-lines { margin: 22px 0 0; padding-left: 20px; font-size: 16px; line-height: 1.85; color: #3a3a3c; }\nhtml[data-macos-desktop] .macos-deck-brand { margin-top: auto; font-size: 11px; color: #9a9aa0; }\nhtml[data-macos-desktop] .macos-deck-nav { display: flex; align-items: center; justify-content: center; gap: 14px; padding-top: 10px; font-size: 12px; color: var(--mac-label-2); }\n\n/* ---------- selection hygiene: chrome never looks \"selected\" blue ---------- */\nhtml[data-macos-desktop] .macos-desktop,\nhtml[data-macos-desktop] .macos-window,\nhtml[data-macos-desktop] .macos-titlebar,\nhtml[data-macos-desktop] .macos-dock,\nhtml[data-macos-desktop] .macos-menubar,\nhtml[data-macos-desktop] .macos-chrome-tabs,\nhtml[data-macos-desktop] .macos-chrome-bar,\nhtml[data-macos-desktop] .macos-browser-status,\nhtml[data-macos-desktop] .macos-browser-hole {\n  -webkit-user-select: none;\n  user-select: none;\n}\nhtml[data-macos-desktop] ::selection { background: rgba(10, 132, 255, 0.25); color: inherit; }\nhtml[data-macos-desktop] .macos-term-text::selection,\nhtml[data-macos-desktop] .macos-notes-editor::selection,\nhtml[data-macos-desktop] .macos-notes-preview ::selection,\nhtml[data-macos-desktop] input::selection,\nhtml[data-macos-desktop] textarea::selection {\n  background: rgba(10, 132, 255, 0.35);\n}\nhtml[data-macos-desktop] .macos-browser-hole:focus,\nhtml[data-macos-desktop] .macos-browser-hole:focus-visible {\n  outline: none !important;\n  box-shadow: none !important;\n}\n\n/* ---------- desktop assistant bubble / native conversation ---------- */\n.macos-bubble {\n  position: fixed; right: 26px; bottom: 108px; width: 46px; height: 46px;\n  border-radius: 50%; border: 0; cursor: default; z-index: 640;\n  display: flex; align-items: center; justify-content: center;\n  background: rgba(255, 255, 255, 0.62); backdrop-filter: saturate(180%) blur(20px);\n  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18), inset 0 0 0 0.5px rgba(255, 255, 255, 0.7);\n  transition: transform 0.16s ease, background 0.16s ease;\n}\n.macos-bubble:hover { transform: scale(1.06); background: rgba(255, 255, 255, 0.78); }\n.macos-bubble.on { background: #0a84ff; }\n.macos-bubble.on .macos-bubble-ic path { fill: #fff; }\n.macos-bubble-ic { width: 26px; height: 26px; }\n.macos-bubble-dot {\n  position: absolute; left: 50%; bottom: -9px; width: 4px; height: 4px; margin-left: -2px;\n  border-radius: 50%; background: rgba(0, 0, 0, 0.35);\n}\n.macos-desktop.dark .macos-bubble { background: rgba(40, 40, 42, 0.66); }\n.macos-desktop.dark .macos-bubble.on { background: #0a84ff; }\n\n/* the real conversation panel, floated over the desktop while the bubble is open */\nhtml[data-macos-desktop][data-macos-chat='on'] [class*='_centerCol'] {\n  position: fixed !important; left: 50% !important; top: 6vh !important;\n  transform: translateX(-50%) !important;\n  width: min(1040px, 88vw) !important; height: 80vh !important;\n  z-index: 620 !important; border-radius: 14px; overflow: hidden;\n  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.32), 0 0 0 0.5px rgba(0, 0, 0, 0.14);\n  background: var(--dsw-alias-bg-base);\n}\nhtml[data-macos-desktop][data-macos-chat='on'] [class*='_centerCol'] > * { height: 100% !important; }\n\n/* ---------- Launchpad ---------- */\n.macos-launchpad {\n  position: fixed; inset: 0; z-index: 660; display: flex; flex-direction: column;\n  align-items: center; gap: 30px; padding: 78px 0 0;\n  background: rgba(18, 18, 22, 0.42); backdrop-filter: blur(36px) saturate(160%);\n}\n.macos-launchpad-search {\n  width: 320px; height: 32px; border-radius: 16px; border: 0; text-align: center;\n  background: rgba(255, 255, 255, 0.2); color: #fff; outline: none; font-size: 13px;\n}\n.macos-launchpad-search::placeholder { color: rgba(255, 255, 255, 0.7); }\n/* 5 per row, and the last row stays centred like Launchpad does */\n.macos-launchpad-grid {\n  display: flex; flex-wrap: wrap; justify-content: center; align-content: flex-start;\n  gap: 36px 28px; width: 862px; max-width: 92vw;\n}\n.macos-launchpad-app {\n  width: 150px; display: flex; flex-direction: column; align-items: center; gap: 10px;\n  border: 0; background: transparent; cursor: default; padding: 4px;\n}\n.macos-launchpad-app:hover .macos-launchpad-label { background: rgba(255, 255, 255, 0.18); }\n.macos-launchpad-ic { width: 62px; height: 62px; display: flex; }\n.macos-launchpad-ic svg { width: 62px; height: 62px; }\n.macos-launchpad-label {\n  color: #fff; font-size: 12px; padding: 2px 8px; border-radius: 6px;\n  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);\n}\n\n/* ---------- Spotlight ---------- */\n.macos-spotlight-wrap {\n  position: fixed; left: 50%; top: 15vh; transform: translateX(-50%); width: 640px; z-index: 680;\n}\n.macos-spotlight { display: flex; flex-direction: column; }\n.macos-spotlight-input {\n  width: 100%; height: 58px; border: 0; border-radius: 12px; padding: 0 20px; font-size: 22px;\n  background: rgba(250, 250, 252, 0.9); backdrop-filter: blur(30px); color: #1d1d1f; outline: none;\n  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.34), 0 0 0 0.5px rgba(0, 0, 0, 0.12);\n}\n.macos-spotlight-list {\n  margin-top: 8px; border-radius: 12px; overflow: hidden;\n  background: rgba(250, 250, 252, 0.94); backdrop-filter: blur(30px);\n  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);\n}\n.macos-spotlight-row { display: flex; align-items: center; gap: 10px; padding: 8px 14px; font-size: 13px; color: #1d1d1f; cursor: default; }\n.macos-spotlight-row:hover { background: #0a84ff; color: #fff; }\n.macos-spotlight-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.macos-spotlight-kind { font-size: 11px; opacity: 0.55; }\n.macos-desktop.dark .macos-spotlight-input, .macos-desktop.dark .macos-spotlight-list { background: rgba(44, 44, 46, 0.94); color: #f5f5f7; }\n.macos-desktop.dark .macos-spotlight-row { color: #f5f5f7; }\n\n/* ---------- Control Centre ---------- */\n.macos-cc {\n  position: fixed; right: 14px; top: 34px; width: 300px; z-index: 670; padding: 12px;\n  border-radius: 16px; display: flex; flex-direction: column; gap: 10px;\n  background: rgba(246, 246, 248, 0.72); backdrop-filter: blur(32px) saturate(170%);\n  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.26), 0 0 0 0.5px rgba(0, 0, 0, 0.12);\n}\n.macos-cc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }\n.macos-cc-row { display: flex; gap: 8px; align-items: center; }\n.macos-cc-tile {\n  display: flex; align-items: center; gap: 8px; padding: 10px; border: 0; border-radius: 12px;\n  background: rgba(255, 255, 255, 0.66); color: #1d1d1f; font-size: 12px; cursor: default; text-align: left;\n}\n.macos-cc-tile.on { background: #0a84ff; color: #fff; }\n.macos-cc-tile-ic { font-size: 15px; }\n.macos-cc-tile-label { display: flex; flex-direction: column; line-height: 1.25; }\n.macos-cc-foot { font-size: 11px; color: rgba(60, 60, 67, 0.7); }\n.macos-cc-glyph { font-size: 13px; }\n.macos-cc input[type='range'] { width: 100%; }\n.macos-desktop.dark .macos-cc { background: rgba(38, 38, 40, 0.76); }\n.macos-desktop.dark .macos-cc-tile { background: rgba(255, 255, 255, 0.12); color: #f5f5f7; }\n\n/* ---------- desktop widgets (Sonoma) ---------- */\n.macos-widgets { position: fixed; right: 24px; top: 52px; display: flex; flex-direction: column; gap: 12px; z-index: 30; }\n.macos-widget {\n  width: 188px; padding: 12px 14px; border-radius: 16px;\n  background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(26px) saturate(160%);\n  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.14), inset 0 0 0 0.5px rgba(255, 255, 255, 0.6);\n}\n.macos-widget-time { font-size: 30px; font-weight: 300; letter-spacing: -0.5px; color: #1d1d1f; line-height: 1.1; }\n.macos-widget-sub { font-size: 11px; color: rgba(60, 60, 67, 0.7); margin-top: 2px; }\n.macos-widget-head { font-size: 12px; font-weight: 600; color: #ff3b30; margin-bottom: 6px; }\n.macos-widget-cal { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px 0; text-align: center; }\n.macos-widget-dow { font-size: 9px; color: rgba(60, 60, 67, 0.55); }\n.macos-widget-day { font-size: 10px; color: #1d1d1f; padding: 1px 0; }\n.macos-widget-day.today { background: #ff3b30; color: #fff; border-radius: 50%; }\n.macos-desktop.dark .macos-widget { background: rgba(40, 40, 42, 0.55); }\n.macos-desktop.dark .macos-widget-time, .macos-desktop.dark .macos-widget-day { color: #f5f5f7; }\n";
    let disposeStyle = null;
    let ctxRef = null;

    return {
      name: 'macos-desktop',
      inject: ['slots'],
      apply(ctx) {
        hostCtx = ctx;
        ctxRef = ctx;

        disposeStyle = ctx.effect(() => {
          const el = document.createElement('style');
          el.id = 'macos-desktop-css';
          el.setAttribute('data-plugin', 'macos-desktop');
          el.textContent = CSS;
          document.head.appendChild(el);
          return () => { el.remove(); };
        }, 'macos-desktop: styles');

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'macos-desktop',
          order: 500,
        }, Overlay));

        // learn ego's tab type as soon as its registry appears
        ctx.effect(() => {
          const beat = () => { try { installHook(); } catch (e) { /* ignore */ } };
          const timer = window.setInterval(() => {
            beat();
            if (egoDef) window.clearInterval(timer);
          }, 200);
          beat();
          return () => window.clearInterval(timer);
        }, 'macos-desktop: ego probe');

        // keep the floating panel glued to the browser window; reconcile panel/tab state
        ctx.effect(() => {
          let n = 0;
          const timer = window.setInterval(() => {
            n += 1;
            try { reconcile(); } catch (e) { /* keep the loop alive */ }
            try { if (S.active) syncPanelGeometry(); } catch (e) { /* ignore */ }
            try { if (S.active) reroutePanelFocus(); } catch (e) { /* ignore */ }
          }, 200);
          return () => window.clearInterval(timer);
        }, 'macos-desktop: reconcile');

        ctx.effect(() => () => {
          setActive(false);
          if (disposeStyle) disposeStyle();
          disposeStyle = null;
          ctxRef = null;
        }, 'macos-desktop: teardown');
      },
    };
  },
});
