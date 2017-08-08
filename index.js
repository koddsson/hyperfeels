const fs = require("fs");
const os = require("os");

exports.decorateTerm = (Term, { React, notify }) => {
  // Define and return our higher order component.
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);

      this._onTerminal = this._onTerminal.bind(this);
    }

    _onTerminal(term) {
      if (this.props.onTerminal) this.props.onTerminal(term);

      const terminal = document.querySelector(".terms_termGroup");
      const container = document.createElement("div");
      const color = "rgba(129, 147, 151, 0.32)";

      container.style.display = "flex";
      container.style.bottom = 0;
      container.style.position = "absolute";
      container.style.color = color;
      container.style.borderTop = `1px solid ${color}`;
      container.style.width = "100%";
      container.style.height = "22px";
      container.style.fontSize = "12px";
      container.style.transition = "0.2s ease-in-out";

      // Height of container + 1px border
      container.style.transform = "translateY(23px)";

      const mood = document.createElement("span");
      mood.innerText = "😄";

      mood.style.flex = 0;
      mood.style.color = "black";
      mood.style.paddingLeft = "5px";
      mood.style.cursor = "pointer";
      mood.style.webkitUserSelect = "none";

      mood.addEventListener("click", event => {
        console.log("clicked!");
      });

      container.appendChild(mood);

      const journalInput = document.createElement("input");

      journalInput.style.flex = 1;
      journalInput.style.backgroundColor = "transparent";
      journalInput.style.border = 0;
      journalInput.style.outline = "none";
      journalInput.style.marginLeft = "5px";

      journalInput.addEventListener("keydown", event => {
        console.log(event);
        if (event.metaKey && event.key === "b") {
          container.style.transform = "translateY(23px)";
          terminal
            .querySelector("iframe")
            .contentWindow.document.body.querySelector("x-screen")
            .focus();
          terminal.style.paddingBottom = "0";
        } else if (event.key === "Enter") {
          fs.writeFile(
            os.homedir() + "/.koddsson-journal.txt",
            event.target.value,
            { flag: "a+" },
            err => {
              if (err) {
                alert("Something went wrong!");
                console.log(err);
              } else {
                event.target.value = "";
                terminal
                  .querySelector("iframe")
                  .contentWindow.document.body.querySelector("x-screen")
                  .focus();
                container.style.transform = "translateY(23px)";
              }
            }
          );
        }
      });

      container.appendChild(journalInput);

      const caffeineIndicator = document.createElement("span");

      caffeineIndicator.innerText = "☕️";

      caffeineIndicator.style.flex = 0;
      caffeineIndicator.style.color = "black";
      caffeineIndicator.style.paddingRight = "5px";
      caffeineIndicator.style.cursor = "pointer";
      caffeineIndicator.style.webkitUserSelect = "none";

      container.appendChild(caffeineIndicator);

      terminal.style.transition =
        "0.15s padding ease-out, 0.15s margin ease-out, 0.15s border ease-out";

      terminal.appendChild(container);

      const handler = [
        "keydown",
        function(event) {
          if (event.metaKey && event.key === "b") {
            // Store the state in the styles like a boss
            if (container.style.transform === "") {
              container.style.transform = "translateY(23px)";
              terminal.style.paddingBottom = "0";
            } else {
              container.style.transform = "";
              container.querySelector("input").focus();
              terminal.style.paddingBottom = "10px";
            }
          }
        }.bind(term.keyboard)
      ];

      term.uninstallKeyboard();
      term.keyboard.handlers_ = [handler].concat(term.keyboard.handlers_);
      term.installKeyboard();
    }

    render() {
      return React.createElement(
        Term,
        Object.assign({}, this.props, {
          onTerminal: this._onTerminal
        })
      );
    }
  };
};
