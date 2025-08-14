function handleMenu() {
    const menu = document.querySelector("div.header .menu-tab");

    if (!menu) return;

    menu.addEventListener("click", () => {
        const header = document.querySelector("div.header");
        const check = header.classList.contains("heightDown");

        !check ? [header.classList.add("heightDown"), menu.innerHTML = "X", menu.style.color = "red"] : [header.classList.remove("heightDown"), menu.innerHTML = "=", menu.style.color = "var(--primary)"];
    })
}

window.addEventListener("DOMContentLoaded", () => {
    handleMenu();
})