import React, { useCallback, useState } from "react";
import classnames from "classnames";
// you should import `lodash` as a whole module
import lodash from "lodash";
import axios from "axios";

// const ITEMS_API_URL = "https://example.com/api/items";
const ITEMS_API_URL = "http://localhost:42069/api/items";
const DEBOUNCE_DELAY = 500;

// the exported component can be either a function or a class
export default function Autocomplete() {
  const [autocompleteList, setAutocompleteList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useCallback(
    lodash.debounce(async (q) => {
      setIsLoading(true);
      let list = [];
      try {
        const response = await axios.get(ITEMS_API_URL, {
          timeout: 1000,
          params: {
            q: q,
          },
        });
        list = response.data;
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
      setAutocompleteList(list);
    }, DEBOUNCE_DELAY),
    []
  );

  const handleChange = (e) => {
    const searchInput = `${e.target.value}`.trim();
    searchInput && debouncedQuery(searchInput);
  };

  return (
    <div className={`wrapper${isLoading ? "" : " is-loading"}`}>
      <div className="control">
        <input type="text" className="input" onChange={handleChange} />
      </div>
      {isLoading ||
        (autocompleteList.length > 0 && (
          <div className="list is-hoverable">
            {autocompleteList.map((listItem, index) => (
              <a
                className="list-item"
                href="#"
                id={`${index}`}
                key={`${index}`}
                onSelectItem={(item) => {}}
                onClick={(e) => e.stopPropagation()}
              >
                {listItem}
              </a>
            ))}
          </div>
        ))}
    </div>
  );
}
