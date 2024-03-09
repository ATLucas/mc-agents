
- Bot data
    - Skill to set bot data
        - Set a bot's "spawn" waypoint
    - When world bot is spawned and doesn't have a spawn point set, set it to the player's current position
    - When a new bot is created, can supply a waypoint, else it will be the world bot's spawn waypoint
    - Skill to query bot data
    - Save GPT assistant and thread IDs in bot data for persistence across runs
        - Remove code to delete the GPT stuff on shutdown
    - When programs start-up, spawn in all the bots to their spawn points

- Bot types
    - Types
        - world
            - set waypoints
            - spawn bots
        - terraformer
        - lumberjack
        - miner
        - wheat farmer
        - baker
        - smith
    - Assign types when bot is created
    - Choose available skills based on bot type
    - Really need skins for each type of bot

- World bot
    - spawn skills
    - waypoint skills
    - Skill to teleport player to a given waypoint?

- Bugs in block placement for the leveling
    - Need some way to get closer to the placement square, like go look at the reference block face
    - Jump placement is a possibility, but not a great one

- Wood foraging expedition
    - Spiral exploration
    - Chop down trees
    - Continue until you have enough wood (pickaxe and some extra planks)
    - Optionally wait for saplings to drop
    - Return to base and deposit materials

- Builder Skill: Upgrade base to level 1
    - level a 3x3 area
    - 3x3 wood floor around anchor
    - Crafting table
    - Chest

---

- Safety tactics:
    - Craft wood sword
    - Equip sword
    - Hunt sheep and cows
    - Craft bed and place in base

- Night behavior
    - Poll or listen for time of day events
    - Retreat to base and sleep when night approaches
    - Optionally continue previous task the next day (would require more advanced state tracking...for now easier to only retreat to base after a skill is complete)

- Stone tools
    - Craft wooden pickaxe
    - Human chooses location for mine
    - Bot places a wood plank at start of mine
    - Dig down to a certain y value to acquire enough stone for all tools
    - Craft arbitrary tools
        - wood, stone
        - pickaxe, axe, sword, shovel, hoe
    - Equip the correct tool before digging

- Wood foraging round 2
    - Craft some stone axes
    - Forage for trees (wood for burning, building, and crafting)
    - Wait for saplings to drop
    - Return to base and deposit materials

- Coal foraging
    - Craft some stone pickaxes
    - Explore, especially mountains
    - Mine coal
    - Return to base and deposit materials

- Dinner
    - Craft furnace
    - Cook meat using coal

- Create a tree farm
    - provide an anchor
    - Specify a farm size (could be blocks or trees)
    - level the farm area
    - replace any stone with dirt
    - plant the saplings (assuming we have some)

- Farm trees
    - understand the locations and boundaries
    - cut down the trees
    - wait for saplings
    - re-plant the trees
    - store wood and excess saplings in the base

- Iron
    - Craft some stone pickaxes
    - Strip mine for iron
    - Craft iron tools
    - Craft armor

- Create a wheat farm
    - provide an anchor
    - level the farm area
    - replace any stone with dirt
    - craft a bucket
    - create a well
    - create irrigation channels
    - hoe the dirt
    - plant the seeds
    - store wood and excess saplings in the base

- Farm wheat
    - understand location and boundaries
    - wait for wheat to grow
    - chop down wheat
    - plant new seeds

- Upgrade base to level 2
    - actual walls and door

- Combat
    - Equip sword
    - Battle tactics

- Keep leveling-up the base to add more bots...or create a new base for each bot
