export const globalStatusDropdownOptions = (globalStatusArray) => {
    if (globalStatusArray) {
      const vbl = globalStatusArray[0];
      const dropdownOptions = vbl?.map((item) => {
        let obj = {};
        obj.label = item;
        obj.value = item;
        return obj;
      });
      return dropdownOptions;
    }
    return [];
  };
  