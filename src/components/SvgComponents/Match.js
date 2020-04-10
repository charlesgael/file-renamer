import * as React from "react";

function SvgMatch(props) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 11 11" {...props}>
            <g transform="translate(.5 .5)">
                <circle cx={4} cy={4} r={4} stroke="#3E576A" fill="#EFEFF3" />
                <path stroke="#3E576A" d="M7 7l2 2" />
                <circle cx={4} cy={4} r={3} fill="#54BAE6" />
                <circle cx={4} cy={4} r={2} fill="#3E5868" />
                <circle cx={3.8} cy={3.4} r={0.3} fill="#fff" />
                <circle cx={3.2} cy={2.6} r={0.5} fill="#fff" />
                <path d="M7 8.5L8.5 7 10 8.5s.7.8 0 1.5-1.5 0-1.5 0M7 8.5z" fill="#F76D56" />
            </g>
        </svg>
    );
}

export default SvgMatch;
