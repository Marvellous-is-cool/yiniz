import { hid_show, add_eff } from "./AnimUtils.js";

export const AnimDisp = () => {
  const docu = document.querySelector(".document");
  const vids = document.querySelector(".videos");
  const arti = document.querySelector(".articles");
  const edu = document.querySelector(".edutech_name");

  const docm = document.querySelector("#documents");
  const vid = document.querySelector("#videos");
  const art = document.querySelector("#articles");
  const txt = document.querySelector(".txt");

  docu.addEventListener("click", () => {
    hid_show(docm, "show");
    hid_show(vid, "hide");
    hid_show(art, "hide");
    hid_show(txt, "hide");
    add_eff(docu, "s");
    add_eff(vids, "h");
    add_eff(arti, "h");
  });

  vids.addEventListener("click", () => {
    hid_show(docm, "hide");
    hid_show(vid, "show");
    hid_show(art, "hide");
    hid_show(txt, "hide");
    add_eff(docu, "h");
    add_eff(vids, "s");
    add_eff(arti, "h");
  });

  arti.addEventListener("click", () => {
    hid_show(docm, "hide");
    hid_show(vid, "hide");
    hid_show(art, "show");
    hid_show(txt, "hide");
    add_eff(docu, "h");
    add_eff(vids, "h");
    add_eff(arti, "s");
  });

  edu.addEventListener("click", () => {
    hid_show(docm, "hide");
    hid_show(vid, "hide");
    hid_show(art, "hide");
    hid_show(txt, "show");
    edu.classList.add("animate__pulse");
  });
};
