#!/bin/bash

# 1. Sync from 'out' back to 'runtime' ONLY if you edited in the game
rsync -u out/data/Default/terrain_maps.dat runtime_files/data/Default/terrain_maps.dat

# 2. Sync from 'runtime' to 'out' ONLY if you edited the text file manually
rsync -u runtime_files/data/Default/terrain_maps.dat out/data/Default/terrain_maps.dat
----
# 1. Ensure the 'out' directory exists
mkdir -p out

# 2. Sync runtime files ONLY if they've changed or are missing
# 'rsync' is smarter than 'cp' - it only copies new/changed files
rsync -av --progress runtime_files/ out/

# 3. Enter build folder and compile
cd build || exit
make -j$(sysctl -n hw.ncpu)

# 4. Check if build was successful
if [ $? -eq 0 ]; then
    echo "--- Build Successful! ---"
    
    # 5. Move the new executable to out
    cp OpenNotrium ../out/
    
    # 6. Run the game from the out folder so it sees the Mod
    cd ../out
    ./OpenNotrium
else
    echo "--- Build Failed! ---"
fi