import { hid_show, add_eff2, add_eff3 } from "./AnimUtils.js";

export const DocInfo = () => {
  const docu__content = document.querySelector(".docu__content");
  const docu__content_name = document.querySelector(".docu__content_name");
  const docu_view = document.querySelector(".docu_view");

  docu_view.addEventListener("click", () => {
    add_eff2(docu__content, "s");
  });
};
