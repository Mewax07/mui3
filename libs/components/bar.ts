import { Component } from "../utils/component";
import { placeholder, prop } from "../utils/decorator";
import { Html } from "../utils/html";
import { WithEnumMethod, WithPropMethods } from "../utils/types";
import { Button } from "./button";

enum AppsBarType {
    SEARCH = "search",
    LARGE = "large",
    MEDIUM = "medium",
    SMALL = "small",
}

interface AppsBarProps {
    title: string;
    subtitle: string;
    icon: string;
    showBackButton: boolean;
    actions: Component[];
}

export interface AppsBar
    extends
        WithPropMethods<AppsBarProps, AppsBar>,
        WithEnumMethod<"type", AppsBarType, AppsBar> {}

export class AppsBar extends Component {
    @prop("enum", {
        enumValues: AppsBarType,
    })
    private type: AppsBarType = AppsBarType.LARGE;

    @prop("string")
    private title: string = "Headline";

    @prop("string")
    private subtitle: string = "Subtitle";

    @prop("string")
    private icon: string = "arrow-left";

    @prop("boolean")
    private showBackButton: boolean = true;

    @prop("array")
    private actions: Component[] = [];

    @placeholder("icon")
    private iconSlot?: Html;

    @placeholder("html")
    private actionsSlot?: Html;

    constructor() {
        super();
        this.init();
    }

    private init() {
        const defaulButton = new Button().setLabel("+");

        this.actions = [defaulButton];
    }

    protected template(): Html {
        const container = new Html().class("appsbar", `appsbar--${this.type}`);

        const content = new Html().class("content");

        if (this.showBackButton) {
            const backButton = new Html("button")
                .class("back")
                .attr("aria-label", "Back")
                .append(
                    new Html()
                        .dataset("slot", "iconSlot")
                        .append(new Html("i").class("icon").text("<-")),
                );

            content.append(backButton);
        }

        const titleSection = new Html().class("text-section");

        if (this.type !== AppsBarType.SEARCH) {
            titleSection.append(new Html("h1").class("title").text(this.title));
            titleSection.append(
                new Html("p").class("subtitle").text(this.subtitle),
            );
        }

        if (this.type === AppsBarType.SEARCH) {
            titleSection.append(
                new Html()
                    .class("search")
                    .append(
                        Html.input()
                            .attr("type", "search")
                            .attr("placeholder", this.title)
                            .class("input"),
                    ),
            );
        }

        content.append(titleSection);

        const actionsSections = new Html()
            .class("actions")
            .attr("data-slot", "actionsSlot");

        this.actions.forEach((action) => {
            console.log(action);
            if (action instanceof Component) {
                actionsSections.append(action.mount());
            } else if (action instanceof Html) {
                actionsSections.append(action);
            }
        });

        content.append(actionsSections);
        container.append(content);

        return container;
    }

    protected onPropChange(
        propName: string,
        newValue: any,
        oldValue: any,
    ): void {
        if (!this._mounted) return;

        switch (propName) {
            case "type":
                this._root
                    .classOff(`appsbar--${oldValue}`)
                    .classOn(`appsbar--${newValue}`);
                break;
            case "title":
                const titleEl = this._root.qs(".appsbar-title");
                if (titleEl) titleEl.text(newValue);
                const searchInput = this._root.qs(".appsbar-search-input");
                if (searchInput) searchInput.attr("placeholder", newValue);
                break;
            case "subtitle":
                const subtitleEl = this._root.qs(".appsbar-subtitle");
                if (subtitleEl) subtitleEl.text(newValue);
                break;
            case "icon":
                const iconSlot = this.getSlot("iconSlot");
                if (iconSlot) {
                    iconSlot
                        .clear()
                        .append(
                            new Html("i")
                                .classOn("icon", `icon-${newValue}`)
                                .text("←"),
                        );
                }
                break;
            case "actions":
                this.updateActions();
                break;
        }
    }

    private updateActions(): void {
        const actionsSlot = this.getSlot("actionsSlot");
        if (!actionsSlot) return;

        actionsSlot.clear();
        this.actions.forEach((action) => {
            if (action instanceof Component) {
                actionsSlot.append(action.mount());
            } else if (action instanceof Html) {
                actionsSlot.append(action);
            }
        });
    }
}
