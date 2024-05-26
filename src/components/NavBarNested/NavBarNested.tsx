"use client";

import { ScrollArea } from '@mantine/core';
import { UserButton } from 'components/UserButton/UserButton';
import { LinksGroup } from 'components/NavbarLinksGroup/NavbarLinksGroup';
import data from 'components/NavbarNested/NavbarNested.json';
import classes from 'components/NavbarNested/NavbarNested.module.css';

export function NavbarNested() {
    const links = data.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <UserButton />
            </div>
        </nav>
    );
}
