import { Button } from "@material-tailwind/react";
import { useState } from "react";
import Auth from "./auth";

function NotAuth() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center justify-center w-full h-[500px] flex-col">
            <h1>Siz profilga kirmagansiz!</h1>
            <Button onClick={() => setOpen(true)} className="rounded" color="red">Profilga kirish</Button>
            <Auth open={open} setOpen={setOpen} />
        </div>
    );
}

export default NotAuth;