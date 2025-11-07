import { foo } from "foo";
import { get } from "lodash-es";
import { getTime } from "utils";
function testLodash() {
  const fooA = {
    a: "a",
    b: "b",
  };
  console.log(get(fooA, "a"));
  console.log("getTime", getTime());
}

foo();
testLodash();
