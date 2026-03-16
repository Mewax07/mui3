import { getComponentMetadata } from "./decorator";
import { Html } from "./html";
import { PlaceholderType } from "./types";

export abstract class Component<T extends HTMLElement = HTMLElement> {
    protected _root: Html<T>;
    protected _mounted: boolean = false;
    protected _slots: Map<string, Html[]> = new Map();

    constructor(tag: keyof HTMLElementTagNameMap = "div") {
        this._root = new Html(tag) as Html<T>;
        this.initializeSlots();
    }

    private initializeSlots(): void {
        const metadata = getComponentMetadata(this.constructor);

        metadata.placeholders.forEach((meta, name) => {
            this._slots.set(name, []);
            if (meta.defaultContent) {
                const slot = this.createSlotElement(
                    meta.defaultContent,
                    meta.type,
                );
                this._slots.get(name)!.push(slot);
            }
        });
    }

    private createSlotElement(content: any, type: PlaceholderType): Html {
        if (typeof content === "string") {
            if (type === "icon") {
                return new Html("span")
                    .class("material-symbols-outlined")
                    .text(content);
            }
            return new Html("span").text(content);
        }

        if (content instanceof Component) {
            return content.mount();
        }

        if (content instanceof Html) {
            return content;
        }

        return new Html("div").append(content);
    }

    private validateSlotType(content: any, type: PlaceholderType): boolean {
        switch (type) {
            case "text":
                return typeof content === "string";
            case "icon":
                return typeof content === "string";
            case "html":
                return content instanceof Html;
            case "component":
                return content instanceof Component;
            default:
                return true;
        }
    }

    protected abstract template(): Html;

    protected onMount?(): void;

    protected onPropChange?(
        propName: string,
        newValue: any,
        oldValue: any,
    ): void;

    protected onPlaceholderChange?(slotName: string, newContent: Html): void;

    public mount(): Html<T> {
        if (this._mounted) return this._root;

        this._root = this.template() as Html<T>;
        this._mounted = true;

        this._slots.forEach((elements, name) => {
            const slotTarget = this._root.qs(`[data-slot="${name}"]`);
            if (!slotTarget) {
                console.warn(
                    `Slot "${name}" not found in template. Make sure you have an element with data-slot="${name}"`,
                );
                return;
            }
            elements.forEach((el) => slotTarget.append(el));
        });

        if (this.onMount) this.onMount();
        return this._root;
    }

    protected addSlot(
        name: string,
        element: Html | Component | string,
        type?: PlaceholderType,
    ): this {
        let slot = this._slots.get(name);
        if (!slot) {
            slot = [];
            this._slots.set(name, slot);
        }

        if (type && !this.validateSlotType(element, type)) {
            console.warn(
                `Type mismatch: expected ${type} for placeholder "${name}", got ${typeof element}`,
            );
            return this;
        }

        let el: Html;
        if (typeof element === "string") {
            if (type === "icon") {
                el = new Html("span")
                    .class("material-symbols-outlined")
                    .text(element);
            } else {
                el = new Html("span").text(element);
            }
        } else if (element instanceof Component) {
            el = element.mount();
        } else {
            el = element;
        }

        slot.push(el);

        if (this._mounted) {
            const target = this._root.qs(`[data-slot="${name}"]`);
            if (target) {
                target.append(el);
            } else {
                console.warn(
                    `Cannot add to slot "${name}": slot not found in mounted template`,
                );
            }
        }

        if (this.onPlaceholderChange) this.onPlaceholderChange(name, el);
        return this;
    }

    public setSlot(
        name: string,
        content: Html | Component | string | (Html | Component | string)[],
        type?: PlaceholderType,
    ): this {
        this.clearSlot(name);
        if (Array.isArray(content)) {
            content.forEach((c) => this.addSlot(name, c, type));
        } else {
            this.addSlot(name, content, type);
        }
        return this;
    }

    public clearSlot(name: string): this {
        const slot = this._slots.get(name);
        if (!slot) return this;
        slot.length = 0;

        if (this._mounted) {
            const target = this._root.qs(`[data-slot="${name}"]`);
            if (target) target.clear();
        }

        return this;
    }

    public getSlot(name: string): Html[] | undefined {
        return this._slots.get(name);
    }

    public setProps(props: Record<string, any>): this {
        Object.entries(props).forEach(([key, value]) => {
            if (key in this) {
                (this as any)[key] = value;
            }
        });
        return this;
    }

    public getRoot(): Html<T> {
        return this._root;
    }

    public destroy(): void {
        this._root.cleanup();
        this._mounted = false;
    }
}
