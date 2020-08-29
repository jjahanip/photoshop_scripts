# Running Photoshop Scripts


1. __Suppress the RunningScripts warning.__ Follow [this](https://helpx.adobe.com/photoshop/kb/enable-optional-extensions-photoshop-cc.html#:~:text=Save%20the%20file%20as%20%22PSUserConfig,%5C%5BPhotoshop_version%5D%5C%5BPhotoshop_version%5DSettings%5C) instruction:

    1. Navigate to `\Users\[User Name]\AppData\Roaming\Adobe\[Photoshop_version]\[Photoshop_version]Settings\`
    2. Open/create `PSUserConfig.txt`
    3. Insert `WarnRunningScripts 0`

2. Download WebStrom from [here](https://www.jetbrains.com/webstorm/download).
   
3. Create new WebStorm project and set the interpretor to:

    `C:\Program Files\Adobe\Adobe Photoshop 2020 \Photoshop.exe`