// Cute pastel platformer with Super Red Box 
function initGame() {
    // Wait for Kaboom to exist
    if (typeof kaboom === "undefined") {
        setTimeout(initGame, 50);
        return;
    }

    const container = document.getElementById("game-container");
    if (!container) {
        setTimeout(initGame, 50);
        return;
    }

    // Kaboom setup
    kaboom({
        width: 800,
        height: 600,
        root: container,
        background: [202, 235, 255], // soft sky blue
    });

    // Make sure canvas can receive key input
    setTimeout(() => {
        const canvas = container.querySelector("canvas");
        if (canvas) {
            canvas.setAttribute("tabindex", "0");
            canvas.focus();
            canvas.addEventListener("click", () => canvas.focus());
        }
    }, 100);

    // Player constants
    const PLAYER_SPEED = 220;
    const JUMP_FORCE = 620;   
    const GRAVITY = 900;

    setGravity(GRAVITY);

    // Soft background clouds 
    function makeCloud(x, y, w) {
        add([
            rect(w, 25),
            pos(x, y),
            color(255, 255, 255),
            opacity(0.8),
        ]);
        add([
            rect(w * 0.6, 20),
            pos(x + 10, y - 15),
            color(255, 255, 255),
            opacity(0.9),
        ]);
    }

    makeCloud(120, 120, 120);
    makeCloud(480, 80, 150);
    makeCloud(320, 170, 100);

    // Helper: cute pastel platform with a tiny shadow
    function makePlatform(x, y, w, h = 20) {
        // shadow
        add([
            rect(w, h),
            pos(x + 4, y + 6),
            color(0, 0, 0),
            opacity(0.18),
        ]);

        // actual platform
        return add([
            rect(w, h),
            pos(x, y),
            area(),
            body({ isStatic: true }),
            color(255, 204, 153), // peachy platform
            "platform",
        ]);
    }

    // Ground
    makePlatform(0, 560, 800, 40);
    get("platform")[0].color = rgb(144, 238, 144); // make ground a soft green

    // Floating platforms
    makePlatform(180, 430, 160);
    makePlatform(430, 330, 160);
    makePlatform(610, 230, 160);
    makePlatform(110, 200, 160);

    // Player: a pastel box with white outline
    const player = add([
        rect(36, 36),
        pos(120, 100),
        area(),
        body(),
        color(255, 182, 193),        // baby pink
        outline(4, rgb(255, 255, 255)), // white border
        "player",
    ]);

    // Kawaii face that follows the player
    const face = add([
        text("•ᴗ•", { size: 18 }),
        pos(player.pos.x + 8, player.pos.y + 8),
        color(120, 60, 120),
        "playerFace",
    ]);

    // Landing dust state
    let wasGrounded = false;

    //  MOVEMENT & EFFECTS
    onUpdate(() => {
        let dir = 0;

        if (isKeyDown("left") || isKeyDown("a")) dir -= 1;
        if (isKeyDown("right") || isKeyDown("d")) dir += 1;

        player.move(dir * PLAYER_SPEED, 0);

        // keep in bounds
        if (player.pos.x < 0) player.pos.x = 0;
        if (player.pos.x > width() - player.width) {
            player.pos.x = width() - player.width;
        }

        // face follows player
        face.pos.x = player.pos.x + 6;
        face.pos.y = player.pos.y + 6;

        // cute landing dust when touching ground after a fall
        const grounded = player.isGrounded();
        if (grounded && !wasGrounded) {
            // spawn tiny dust poof
            for (let i = 0; i < 4; i++) {
                add([
                    rect(10, 4),
                    pos(player.pos.x + rand(-5, 20), player.pos.y + player.height),
                    color(255, 214, 170),
                    opacity(0.8),
                    lifespan(0.25),
                    move(DOWN, 50),
                ]);
            }
        }
        wasGrounded = grounded;

        // reset if fallen off-screen
        if (player.pos.y > height() + 120) {
            player.pos = vec2(120, 100);
            player.vel = vec2(0, 0);
        }
    });

    // JUMPING
    function tryJump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);

            // sparkles when jumping 
            for (let i = 0; i < 3; i++) {
                add([
                    rect(6, 6),
                    pos(player.pos.x + rand(-5, 20), player.pos.y + 10),
                    color(255, 255, 255),
                    opacity(0.9),
                    lifespan(0.25),
                    move(UP, 80),
                ]);
            }
        }
    }

    onKeyPress("space", tryJump);
    onKeyPress("up", tryJump);

    add([
        text("Use A/D or ←/→ to move   •   Space/↑ to jump ✨", {
            size: 18,
        }),
        pos(40, 20),
        color(40, 40, 60),
        fixed(),
    ]);

    add([
        text("Made with ❤️ by Gen", { size: 16 }),
        pos(20, 570),
        color(60, 40, 80),
        fixed(),
    ]);
}

// Boot when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
} else {
    initGame();
}
