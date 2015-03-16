@ECHO OFF
IF EXIST %USERPROFILE%\.grunt-init GOTO existsalready
MKDIR %USERPROFILE%\.grunt-init
:existsalready
RMDIR /Q /S "%USERPROFILE%\.grunt-init\artist"
MKLINK /D "%USERPROFILE%\.grunt-init\artist" "%cd%\tasks\init\artist"