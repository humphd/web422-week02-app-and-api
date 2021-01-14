import $ from "jquery";
import _ from "lodash";
import "bootstrap";
import dragDrop from "drag-drop/buffer";

import { charCount } from "../shared/charCount";

// Example of a network API that also can be run in browser.
function api(text) {
  function useNetwork() {
    console.log("Using http://localhost:8080 to get char count");

    return fetch("http://localhost:8080/api/charCount", {
      method: "POST",
      body: text,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Did not receive valid response from server");
        }
        return res.json();
      })
      .catch((err) => {
        console.warn("Error fetching from server:", err);
        return charCount(text);
      });
  }

  function useBrowser() {
    console.info("Using browser to get char count");
    return Promise.resolve(charCount(text));
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
  if (window.navigator.onLine) {
    // Send to server if we're online
    return useNetwork();
  }
  // Fallback to calling in browser
  return useBrowser();
}

function processText(text) {
  api(text).then((stats) => $("main").html(buildTable(stats)));
}

dragDrop("body", (files) => {
  // TODO: we only support one file for now
  if (files.length < 1) {
    return;
  }

  const file = files[0];
  const text = file.toString("utf8");
  processText(text);
});

function buildTable(stats) {
  const tableHeader = `
  <table class="table">
  <thead>
    <tr>
      <th scope="col">Count</th>
      <th scope="col">Line</th>
    </tr>
  </thead>
  <tbody>`;

  const tableFooter = `</tbody></table>`;

  const rowsTemplate = _.template(
    `<% _.forEach(lines, function(line) { %>
          <tr>
              <td><%- line.count %></td>
              <td class="text-left"><%- line.line %></td>
          </tr> 
      <% }); %>`
  );
  const rows = rowsTemplate({ lines: stats.lines });

  return tableHeader + rows + tableFooter;
}
