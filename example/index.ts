import { AppsBar, Button, Html } from "../libs";

const bar = new AppsBar().setTitle("test").setSubtitle("test").mount();

new Html().append(bar).appendTo(document.body);
