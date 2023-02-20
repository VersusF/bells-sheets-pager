import { writable } from "svelte/store";
import { UserSettings } from "./types";

export const userSettings = writable(new UserSettings());
