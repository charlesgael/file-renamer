import * as React from "react";

function SvgRename(props) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 32 27" {...props}>
            <g transform="translate(.5 .5)" stroke="#000">
                <rect width={7} height={16} y={5} ry={2} fill="#feffe0" />
                <path d="M3 0h5l3 5h14v16H3z" fill="#c8e4fe" strokeLinejoin="bevel" />
                <path d="M18 26h3l10-10-3-3-10 10z" fill="#a3acfb" />
                <path d="M25 15.5l3 3" />
            </g>
        </svg>
    );
}

export default SvgRename;
