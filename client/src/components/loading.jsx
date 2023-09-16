import { Spinner } from "@material-tailwind/react";

function Loading() {
    return (
        <div className="flex items-center justify-center w-full h-[100vh] fixed top-0 left-0 bg-[#00000092] backdrop-blur-md z-[99]">
            <Spinner/>
        </div>
    );
}

export default Loading;