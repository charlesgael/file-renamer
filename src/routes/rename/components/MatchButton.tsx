import { Button, MenuItem, Typography } from "@material-ui/core";
import React, { FC, ReactNode } from "react";
import { FaWrench } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { Dropdown, ListItemIcon, MultilineButton } from "../../../components/Material";
import { Match } from "../../../components/SvgComponents";
import renameApi from "../../../rename-api/api";
import { Api } from "../../../rename-api/api/type";
import modes from "../../../rename-api/modes";

const MatchButton: FC<{
    mini?: boolean;
    onApiSelected: (format: Api) => void;
}> = ({ mini, onApiSelected }) => {
    // hooks
    const history = useHistory();

    // variables
    const menus = renameApi.values().reduce<{ [k: string]: Api[] }>(
        (acc, value) => ({
            ...acc,
            [value.mode]: [...(acc[value.mode] || []), value],
        }),
        {}
    );

    // listeners
    const editFormat = (key: string) => () => history.push(`/rename/format/${key}`);
    const formatSelected = (format: Api) => () => onApiSelected(format);

    // component
    return (
        <Dropdown
            menu={
                <>
                    {Object.entries(menus).reduce<ReactNode[]>(
                        (acc, [key, entries]) => [
                            ...acc,
                            <title key={`mode-title-${key}`}>{modes.get(key)?.name}</title>,
                            ...entries.map((entry, i) => (
                                <MenuItem
                                    key={`mode-match-${key}-${entry.name.toLowerCase()}`}
                                    onClick={formatSelected(entry)}
                                >
                                    {entry.name}
                                </MenuItem>
                            )),
                            <MenuItem key={`mode-format-${key}`} onClick={editFormat(key)}>
                                <ListItemIcon children={<FaWrench />} />
                                Edit format
                            </MenuItem>,
                        ],
                        []
                    )}
                </>
            }
        >
            {mini ? (
                <Button size="small" startIcon={<Match />}>
                    Match
                </Button>
            ) : (
                <MultilineButton variant="contained">
                    <Typography variant="h4" component="div">
                        <Match />
                    </Typography>
                    <div>Match</div>
                </MultilineButton>
            )}
        </Dropdown>
    );
};

export default MatchButton;
