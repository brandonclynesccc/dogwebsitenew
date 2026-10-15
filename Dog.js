document.addEventListener("DOMContentLoaded", function () {
    const topButton = document.getElementById("top");
    const darkModeButton = document.getElementById("darkMode");

    if (topButton) {
        topButton.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    if (darkModeButton) {
        darkModeButton.addEventListener("click", function () {
            document.body.classList.toggle("light-mode");

            if (document.body.classList.contains("light-mode")) {
                darkModeButton.textContent = "Switch to Dark Mode";
            } else {
                darkModeButton.textContent = "Switch to Light Mode";
            }
        });
    }
});



