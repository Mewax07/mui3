import { getComponentMetadata } from "./decorator";
import { Html } from "./html";
import { PlaceholderType } from "./types";

export abstract class Component<T extends HTMLElement = HTMLElement> {
    protected _root: Html<T>;
    protected _mounted: boolean = false;
    protected _placeholders: Map<string, Html | null> = new Map();

    constructor(tag: keyof HTMLElementTagNameMap = "div") {
        this._root = new Html(tag) as Html<T>;
        this.initializePlaceholders();
    }

    private initializePlaceholders(): void {
        const metadata = getComponentMetadata(this.constructor);
        metadata.placeholders.forEach((meta, name) => {
            this._placeholders.set(
                name,
                meta.defaultContent
                    ? this.resolveContent(meta.defaultContent, meta.type)
                    : null,
            );
        });
    }

    private resolveContent(content: any, type: PlaceholderType): Html {
        if (typeof content === "string") {
            if (type === "icon")
                return new Html("span")
                    .class("material-symbols-outlined")
                    .text(content);
            return new Html("span").text(content);
        }
        if (content instanceof Component) return content.mount();
        if (content instanceof Html) return content;
        return new Html("div").append(content);
    }

    public setPlaceholder(
        name: string,
        content: Html | Component | string,
        type: PlaceholderType,
    ): this {
        const el = this.resolveContent(content, type);
        this._placeholders.set(name, el);

        if (this._mounted) {
            const newRoot = this.template() as Html<T>;
            this._root.elm.replaceWith(newRoot.elm);
            this._root = newRoot;
        }

        if (this.onPlaceholderChange) this.onPlaceholderChange(name, el);
        return this;
    }

    public clearPlaceholder(name: string): this {
        this._placeholders.set(name, null);

        if (this._mounted) {
            const newRoot = this.template() as Html<T>;
            this._root.elm.replaceWith(newRoot.elm);
            this._root = newRoot;
        }

        return this;
    }

    public hasPlaceholder(name: string): boolean {
        return this._placeholders.get(name) !== null;
    }

    public getPlaceholder(name: string): Html | null {
        return this._placeholders.get(name) ?? null;
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

        if (this.onMount) this.onMount();
        return this._root;
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
