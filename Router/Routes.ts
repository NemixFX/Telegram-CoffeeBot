import { ControllersMenu } from "../Controllers/Menu";
const { Router } = require("express");
const router = Router();

let Menu = new ControllersMenu();

router.get("/LoadMenuList", async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.json(await Menu.LoadMenuList());
});

router.get("/TrashMenu", async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.json(Menu.TrashMenu(req.query));
});

router.get("/CreateMenu", async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.json(Menu.CreateMenu(req.query));
});

router.get("/ChangeMenu", async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.json(await Menu.ChangeMenu(req.query));
});

router.get("/", (req, res) => {});

module.exports = router;
