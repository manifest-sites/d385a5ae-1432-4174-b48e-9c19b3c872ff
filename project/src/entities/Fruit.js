import { createEntityClient } from "../utils/entityWrapper";
import schema from "./Fruit.json";
export const Fruit = createEntityClient("Fruit", schema);
