import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const hoverProvider = vscode.languages.registerHoverProvider("notrium", {
    provideHover(document, position) {
      const line = document.lineAt(position.line).text;

      // Matches: ID;//condition  OR  ID;//effect
      const match = line.match(/^\s*(-?\d+);\/\/(condition|effect)/);

      if (match) {
        const id = match[1];
        const type = match[2]; // 'condition' or 'effect'

        const documentation =
          type === "condition" ? conditionDocs[id] : effectDocs[id];

        if (documentation) {
          return new vscode.Hover(new vscode.MarkdownString(documentation));
        }
      }
      return null;
    },
  });

  context.subscriptions.push(hoverProvider);
}

const conditionDocs: { [key: string]: string } = {
  "0": "### 🛡️ 0: Item Requirement\n---\n**p0:** Item ID  \n**p1:** Amount (0 = check if player lacks item)",
  "1": "### 📏 1: Distance from Plot Object\n---\n**p0:** Plot Object ID  \n**p1:** Distance (plus object size)",
  "2": "### 📐 2: Distance from Plot Class\n---\n**p0:** Plot Class ID  \n**p1:** Distance (plus object size)",
  "3": "### 📊 3: Bar >= Value\n---\n**p0:** Bar ID  \n**p1:** Minimum Value",
  "4": "### 💀 4: Area Cleared\n---\nKilled all creatures of type **p0** in area **p1** (-1 = current)",
  "5": "### 📉 5: Bar < Value\n---\n**p0:** Bar ID  \n**p1:** Target Value",
  "6": "### 👽 6: Player Race Is\n---\n**p0:** Race ID",
  "7": "### 🚫 7: Player Race Is NOT\n---\n**p0:** Race ID",
  "8": "### 🎲 8: Random Chance\n---\n1 in (**p0** + 1) chance of being true.",
  "9": "### 🌑 9: Shade Check\n---\n**p0:** 0 = In Shade, 1 = Not in Shade",
  "10": "### 🍖 10: Satiety Check\n---\nCreature has eaten **p0** items.",
  "11": "### ⚔️ 11: Item Wielded\n---\n**p0:** Item ID  \n**p1:** 0 = Wielded, 1 = Not Wielded",
  "12": "### ⚙️ 12: Difficulty Check\n---\nDifficulty is **p0** (0:> , 1:< , 2:==) than **p1** (0:Easy, 1:Normal, 2:Hard)",
  "13": "### 🗺️ 13: Area Check\n---\n**p1:** 0 = Is, 1 = Is Not  \n**p0:** Area ID",
  "14": "### 👣 14: Proximity to Creature\n---\nNearer than **p1** pixels from creature **p0** (Negative = type)",
  "15": "### 👤 15: Player Proximity\n---\n**p1:** 0 = Nearer, 1 = Farther  \n**p0:** Distance in pixels",
  "16": "### ⚖️ 16: Free Weight\n---\nPlayer has **p0** free weight units available.",
  "17": "### 🏜️ 17: Terrain Check\n---\n**p1:** 0 = Is, 1 = Is Not  \n**p0:** Terrain Type ID",
  "18": "### 📈 18: Bar Max Capacity\n---\nBar **p0** maximum is >= **p1**",
  "19": "### 🧠 19: AI Tactic Check\n---\n**p0:** 0:Primary, 1:Secondary  \n**p1:** Tactic ID",
  "20": "### 💢 20: Anger Level\n---\n**p0:** 0:>= , 1:<  \n**p1:** Anger Value",
  "21": "### 🏳️ 21: Side Check\n---\n**p1:** 0 = Is, 1 = Is Not  \n**p0:** Side ID",
  "22": "### 🧬 22: Type/Class Check\n---\n**p1:** 0:Type, 1:Class  \n**p0:** ID",
  "23": "### 🕹️ 23: Is Player\n---\n**p0:** 0 = Is Player, 1 = Is Not Player",
  "24": "### 🔼 24: Player Bar >= Value\n---\n**p0:** Bar ID  \n**p1:** Value",
  "25": "### 🔽 25: Player Bar < Value\n---\n**p0:** Bar ID  \n**p1:** Value",
  "26": "### 🛡️ 26: NOT Type/Class\n---\n**p1:** 0:Type, 1:Class  \n**p0:** ID",
  "27": "### 💬 27: Last Dialog\n---\n**p1:** 0:Was, 1:Was Not  \n**p0:** Dialog ID",
  "28": "### 🌧️ 28: Weather Check\n---\n**p0:** 0 = Is Raining, 1 = Not Raining",
  "29": "### 👥 29: Creature Count (Type)\n---\nAmount of type **p0** in area is >= **p1**",
  "30": "### 👤 30: Creature Count (Type) Low\n---\nAmount of type **p0** in area is < **p1**",
  "31": "### 🏘️ 31: Creature Count (Class)\n---\nAmount of class **p0** in area is >= **p1**",
  "32": "### 🏚️ 32: Creature Count (Class) Low\n---\nAmount of class **p0** in area is < **p1**",
  "33": "### 🏗️ 33: Being Carried\n---\n**p0:** 0 = Is, 1 = Is Not being carried",
  "34": "### 🎒 34: Is Carrying\n---\n**p0:** 0 = Is, 1 = Is Not carrying another",
  "35": "### 📦 35: Distance to Item\n---\nMust be distance **p1** from item **p0**",
  "36": "### 👁️ 36: Bar Visibility\n---\nBar **p0** is **p1** (0:Visible, 1:Hidden)",
  "37": "### 🖱️ 37: Mouse Button\n---\nButton **p0** (0:L, 1:R, 2:M) is **p1** (0:Pressed, 1:Up)",
  "38": "### 🎯 38: Bar == Value\n---\nBar **p0** is equal to **p1** (rounded down)",
  "39": "### ❌ 39: Bar != Value\n---\nBar **p0** is NOT equal to **p1**",
  "40": "### 📉 40: Bar < Bar\n---\nBar **p0** value < Bar **p1** value",
  "41": "### 📈 41: Bar > Bar\n---\nBar **p0** value > Bar **p1** value",
  "42": "### ⚖️ 42: Bar == Bar\n---\nBar **p0** value == Bar **p1** value",
  "43": "### 📉 43: Bar % < Value\n---\nBar **p0** is < **p1**% of maximum",
  "44": "### 📈 44: Bar % > Value\n---\nBar **p0** is > **p1**% of maximum",
  "45": "### ⚔️ 45: Last Hit Weapon\n---\nLast hit was weapon **p0** (negative:class) within **p1** ms",
  "46": "### 🎒 46: Item Class Requirement\n---\nMust have item class **p0** amount **p1**",
  "47": "### 🗺️ 47: Sector Tag Check\n---\n**p0:** Tag ID (0:LIGHTS, 1:NIGHT LIGHTS)  \n**p1:** State (1:On, 0:Off)  \n*Checks Subsector first, then Sector.*",
};

const effectDocs: { [key: string]: string } = {
  "0": "### 💨 0: Nothing\n---\nNo effect.",
  "1": "### 🏃 1: Speed Multiplier\n---\n**p1:** Duration (ms)  \n**p2:** Visual effect (weapon ID)  \n**p3:** Speed multiplier  \n**p4:** Disable speed change on hit (0:No, 1:Yes)",
  "2": "### 👾 2: Start Alien Attack\n---\nTriggers a scripted alien assault.",
  "3": "### 📦 3: Drop Item\n---\n**p1:** Item ID  \n**p2:** Amount  \n**p3:** Random area size (pixels)  \n**p4:** Max similar items in area (0:Inf)",
  "4": "### 📊 4: Increase Creature Bar\n---\n**p1:** Amount  \n**p2:** Cap at Min/Max (0:No, 1:Yes)  \n**p3:** Bar ID",
  "5": "### 📡 5: Activate Scanner\n---\n**p1:** Scanning distance.",
  "6": "### 🔦 6: Targeting Beam\n---\n**p1:** Type (0:Off, 1:Normal, 2:Green on Hit)  \n**p2:** Base length  \n**p3:** Weapon length multiplier",
  "7": "### 💡 7: Set Light to Creature\n---\n**p1:** Light ID (-1:Off)  \n**p2:** Size  \n**p3:** Attachment (0:Hands, 1:Legs, 2:Head)",
  "8": "### 🎨 8: Set Light Level Addition\n---\n**p1:** Type (0:Tiles, 1:Items, 2:Props, 3:Creatures)  \n**p2-p4:** R, G, B values",
  "9": "### 🔫 9: Select Gun\n---\n**p1:** Gun ID.",
  "10": "### 👾 10: Drop Creature\n---\n**p1:** Creature ID  \n**p2:** Side (-1:Same)  \n**p3:** Primary Tactic  \n**p4:** Secondary Tactic",
  "11": "### 📈 11: Change Max Bar\n---\n**p1:** Bar ID  \n**p2:** Amount to change maximum by.",
  "12": "### 🛡️ 12: Change Armor Level\n---\n**p1:** New armor value.",
  "13": "### 📡 13: Creature Detector\n---\n**p1:** Detection distance.",
  "14": "### 🔊 14: Play Sound\n---\n**p1:** Sound ID (sounds.dat)  \n**p2:** Volume.",
  "15": "### 🧬 15: Polymorph (Change Creature)\n---\n**p1:** New Creature ID  \n**p2:** Duration (-1:Inf)  \n**p3:** Visual effect (weapon ID)  \n**p4:** Reset bars (0:Yes, 1:No)",
  "16": "### 🎁 16: Give Item\n---\n**p1:** Item ID  \n**p2:** Amount  \n**p3:** Inventory slot number.",
  "17": "### 🎯 17: Set Creature Bar\n---\n**p1:** Value  \n**p3:** Bar ID.",
  "18": "### 🌡️ 18: Increase Body Temp\n---\n**p1:** Temperature amount to add.",
  "19": "### 🏗️ 19: Drop Plot Object\n---\n**p1:** Object ID  \n**p2:** Object Size  \n**p3:** Random Area Size  \n**p4:** Max similar objects in area.",
  "20": "### 🗺️ 20: Enable Large Map\n---\nShows the full map interface.",
  "21": "### 🌀 21: Teleport\n---\n**p1:** Area ID (-1:Auto)  \n**p2:** Plot Object ID (target)  \n**p3:** Transfer other creatures (0:No, 1:Yes)",
  "22": "### 🏳️ 22: Change Side\n---\n**p1:** New Side ID  \n**p2:** Duration  \n**p3:** Visual effect (weapon ID)",
  "23": "### 🧪 23: Continuous Bar Increase\n---\n**p1:** Amount per tick  \n**p2:** Visual effect  \n**p3:** Bar ID  \n**p4:** Duration",
  "24": "### 🔫 24: Fire Weapon\n---\n**p1:** Weapon ID  \n**p2:** Times  \n**p3:** Dir (0:Norm, 1:Enemy, 2:Rand, 3:Rel, 4:Abs)  \n**p4:** Direction value",
  "25": "### 🎬 25: Show Animation\n---\n**p1:** Animation ID  \n**p2:** Action (0:Continue, 1:End Game)",
  "26": "### 💨 26: Fire Particle (Weapon Params)\n---\n**p1:** Particle ID  \n**p2:** Times  \n**p3:** Use params from Weapon ID",
  "27": "### 🔦 27: Temporary Light\n---\n**p1:** Light ID  \n**p2:** Duration  \n**p3-p4:** Min/Max size",
  "28": "### ⚖️ 28: Complex Bar Math\n---\nBar p1 += Bar p2 * p3.  \n**p4:** Trigger condition (-1:Below Min, 1:Above Max, 0:Normal)",
  "29": "### 📜 29: Run Script\n---\n**p1:** Script ID  \n**p2:** Check conditions (0:No, 1:Yes)",
  "30": "### 🍖 30: Set Eat Amount\n---\n**p1:** New required satiety value.",
  "31": "### 💀 31: Kill Creature (Full Drain)\n---\nSets all bars to minimum.",
  "32": "### 💢 32: Change Anger Level\n---\n**p1:** Anger value (0.0 to 1.0)",
  "33": "### 🖱️ 33: Stagger Mouse\n---\n**p1:** Intensity  \n**p2:** Speed  \n**p3:** Duration",
  "34": "### 👽 34: Change Player Race\n---\n**p1:** New Race ID.",
  "35": "### ⚙️ 35: Toggle Script\n---\n**p1:** Script ID  \n**p2:** (0:Disable, 1:Activate)",
  "36": "### 🌀 36: Shake Screen\n---\n**p1:** Power  \n**p2:** Duration (ms)",
  "37": "### 🌧️ 37: Start Rain\n---\n**p1:** Duration (0 = Stop rain)",
  "38": "### ⏩ 38: Change Game Speed\n---\n**p1:** New speed multiplier.",
  "39": "### 👁️ 39: Show/Hide Bar\n---\n**p1:** Bar ID  \n**p2:** (1:Show, 0:Hide)",
  "40": "### 🧨 40: Destroy Plot Objects\n---\n**p1:** Object ID  \n**p2:** Radius (pixels)",
  "41": "### 🗑️ 41: Destroy Items\n---\n**p1:** Item ID  \n**p2:** Radius  \n**p3:** Max amount (0:All)",
  "42": "### ⚖️ 42: Max Carry Weight\n---\n**p1:** Increase amount.",
  "43": "### ⏪ 43: Rewind Position\n---\nReturns creature to previous frame position.",
  "44": "### 🆙 44: Increase Player Bar\n---\n**p1:** Amount  \n**p2:** Cap (1:Yes)  \n**p3:** Bar ID",
  "45": "### 🚫 45: Jam Weapon\n---\n**p1:** Weapon ID (-1:All)  \n**p2:** Duration  \n**p4:** 0:Individual, 1:Classes",
  "46": "### 🔄 46: Temporary AI Tactic\n---\n**p1:** 0:Prim, 1:Sec  \n**p2:** Tactic ID  \n**p3:** Duration  \n**p4:** Visual effect",
  "47": "### 💬 47: Start Dialog\n---\n**p1:** Dialog ID from dialogs.dat",
  "48": "### 🧲 48: Pick Up Creature\n---\n**p1-p2:** Target type/class  \n**p3:** Distance  \n**p4:** Side (-1:Same, -2:Any)",
  "49": "### 🎥 49: Attach Camera\n---\n**p1:** Target (-1:Player, 0:This [dist p2], 1:Pos)  \n**p3:** Duration",
  "50": "### 🕹️ 50: Remote Control Creature\n---\nControl nearest of (p1:Type/Class) p2. Dist p3, Side p4.",
  "51": "### 🏗️ 51: Be Picked Up\n---\nNearest of (p1:Type/Class) p2 picks up this creature. Dist p3, Side p4.",
  "52": "### 🎒 52: Set Active Inventory\n---\n**p1:** Slot (0 to 20)",
  "53": "### 🧪 53: Continuous Bar Increase (Capped)\n---\n**p1:** Amount  \n**p3:** Bar ID  \n**p4:** Duration. Caps at Max.",
  "54": "### 👻 54: Vanish\n---\n**p1:** Duration (ms)",
  "55": "### 🖱️ 55: Mouse Visibility\n---\n**p1:** (0:Invis, 1:Vis)",
  "56": "### 🕹️ 56: Override Control Type\n---\n**p1:** (-1:Def, 0:Abs, 1:Rel, 2:Vehicle)",
  "57": "### 📅 57: Skip Journal Day\n---\n**p1:** (0:Next, 1+:Specific Day)",
  "58": "### 🎒 58: Inventory View Access\n---\n**p1:** (0:Cannot, 1:Can)",
  "59": "### 🔧 59: Use Player Item\n---\n**p1:** Item ID to force use.",
  "60": "### 🗑️ 60: Drop Access\n---\n**p1:** (0:Cannot, 1:Can)",
  "61": "### 🎵 61: Play Song\n---\n**p1:** Song ID from music.dat",
  "62": "### 📂 62: Inventory Toggle\n---\n**p1:** (0:Close, 1:Open)",
  "63": "### 🎲 63: Random Bar Value\n---\n**p1-p2:** Range  \n**p3:** Bar ID  \n**p4:** (0:Set, 1:Add)",
  "64": "### 📡 64: Radar Toggle\n---\n**p1:** (0:Hide, 1:Show)",
  "65": "### 💥 65: Fire Weapon (Kickback)\n---\nSame as 24, but includes physics kickback.",
  "66": "### 🔫 66: Fire Weapon (Offset)\n---\n**p1:** Weapon ID  \n**p2:** Times  \n**p3-p4:** X/Y fire offset.",
  "67": "### 💨 67: Push Creature (Advanced)\n---\n**p1:** Force  \n**p3:** Dir Type  \n**p4:** Direction",
  "68": "### 🏗️ 68: Drop Plot Object (Coords)\n---\n**p1:** Object ID  \n**p2-p3:** X, Y  \n**p4:** Rotation",
  "69": "### 📊 69: Sync Bar (Player -> Creature)\n---\nAdds Player Bar **p1** value to Creature Bar **p2**.",
  "70": "### 💡 70: Modify Sector Tag\n---\n**p1:** Tag ID  \n**p2:** Action (0:Off, 1:On, 2:Toggle)  \n**p3:** Layer (0:SubOnly, 1:SecOnly, 2:SecFirst, 3:SubFirst)",
};

export function deactivate() {}
