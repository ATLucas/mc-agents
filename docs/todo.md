
- Wood foraging
    - Find trees, not just wood blocks, and return the actual base of the tree (trees must have leaves)
        - Need a way to validate the entire vein
        - Need a way to find a different vein if one vein is invalid
        - Update harvestTree to use findVein, filtering only the logs from the vein (or maybe just break the leaves too)
        - Make sorting configurable, defaulting to asscending by y value

    - Explore for other things besides trees

    - Chop down trees
    - Continue until you have enough wood (pickaxe and some extra planks)
    - Return to base and deposit materials

- Builder Skill: Upgrade base to level 1
    - level a 3x3 area
    - 3x3 wood floor around anchor
    - Crafting table
    - Chest

---

- Bug: Can't set waypoint when far away from world bot
    - Have the world bot always follow the player...could call him the assistant bot
- Bug: If bot initially spawns too far from player, they can't find the player
    - Work-around: respawnBot: Create waypoint, set bot's spawn point, despawn bot, spawn bot
    - Prevention: Require a waypoint when spawning a bot for the first time, similar to botType (NOTE: Can't do this for world bot)
- Bug: Bot sometimes tries to climb trees to get to log drops rather than breaking blocks

- Resource vein detection
- Terrain detection
    - dirt/stone/sand
    - hill
    - cave
    - water
    - lava
    - biome boundaries

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
