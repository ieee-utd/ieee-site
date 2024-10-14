export default function Spawn(type: string, text: string) {
  const staticText: Record<string, string> = {
    success: "◝(⁰▿⁰)◜ Well done!&nbsp;",
    info: "(人´∀`) Heads up!&nbsp;",
    warning: "(°□°)`ᕗ` Warning!&nbsp;",
    danger: "(ง •̀_•́)ง Oh snap!&nbsp;",
    primary: "ദ്ദി(ᵔᗜᵔ) Well done!&nbsp;",
  };

  const notification = document.createElement("div");
  notification.className = "alert hidden fade alert-simple alert-" + type;
  notification.innerHTML =
    `<strong class="notification-text">${staticText[type]}</strong>` + text;

  document.body.appendChild(notification);

  notification.classList.remove("hidden");
  notification.classList.add("show");

  setTimeout(() => {
    notification.remove();
  }, 4000);
}
