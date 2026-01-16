'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Button, Checkbox, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

export interface DownloadMyDataPayload {
    meta: {
        exportedAt: string;
        playerId: number;
        userEmail: string | null;
    };
    profile: Record<string, unknown> | null;
    extraEmails: unknown[];
    countries: unknown[];
    clubs: unknown[];
    totals: Record<string, unknown>;
    outcomes: unknown[];
}

type SectionKey = 'meta' | 'profile' | 'extraEmails' | 'countries' | 'clubs' | 'totals' | 'outcomes';

const sectionDefaults: Record<SectionKey, boolean> = {
    meta: true,
    profile: true,
    extraEmails: true,
    countries: true,
    clubs: true,
    totals: true,
    outcomes: true,
};

export interface Props {
    data: DownloadMyDataPayload;
}

const DownloadMyData: React.FC<Props> = ({ data }) => {
    const [sections, setSections] = useState(sectionDefaults);

    const allSelected = useMemo(() => Object.values(sections).every(Boolean), [sections]);

    const filteredData = useMemo(() => {
        const payload: Record<string, unknown> = {};
        if (sections.meta) payload.meta = data.meta;
        if (sections.profile) payload.profile = data.profile;
        if (sections.extraEmails) payload.extraEmails = data.extraEmails;
        if (sections.countries) payload.countries = data.countries;
        if (sections.clubs) payload.clubs = data.clubs;
        if (sections.totals) payload.totals = data.totals;
        if (sections.outcomes) payload.outcomes = data.outcomes;
        return payload;
    }, [data, sections]);

    const json = useMemo(() => JSON.stringify(filteredData, null, 2), [filteredData]);

    const handleDownload = () => {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const dateStamp = data.meta.exportedAt.replace(/[:.]/g, '-');
        link.href = url;
        link.download = `footy-data-${data.meta.playerId}-${dateStamp}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const setAllSections = (checked: boolean) => {
        setSections({
            meta: checked,
            profile: checked,
            extraEmails: checked,
            countries: checked,
            clubs: checked,
            totals: checked,
            outcomes: checked,
        });
    };

    const toggleSection = (key: SectionKey, checked: boolean) => {
        setSections((prev) => ({ ...prev, [key]: checked }));
    };

    return (
        <Stack gap="lg">
            <Title order={1}>Download my data</Title>
            <Text size="sm" c="dimmed">
                Choose which sections to include, then download or copy the JSON.
            </Text>

            <Group justify="space-between" align="center">
                <Button leftSection={<IconDownload size={16} />} onClick={handleDownload}>
                    Download JSON
                </Button>
            </Group>

            <Paper withBorder p="md" radius="md">
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Text fw={600}>Include in export</Text>
                        <Checkbox
                            label="Select all"
                            checked={allSelected}
                            onChange={(event) => setAllSections(event.currentTarget.checked)}
                        />
                    </Group>

                    <Group gap="md" wrap="wrap">
                        <Checkbox
                            label="Meta"
                            checked={sections.meta}
                            onChange={(event) => toggleSection('meta', event.currentTarget.checked)}
                        />
                        <Checkbox
                            label="Profile"
                            checked={sections.profile}
                            onChange={(event) => toggleSection('profile', event.currentTarget.checked)}
                        />
                        <Checkbox
                            label="Extra emails"
                            checked={sections.extraEmails}
                            onChange={(event) => toggleSection('extraEmails', event.currentTarget.checked)}
                        />
                        <Checkbox
                            label="Countries"
                            checked={sections.countries}
                            onChange={(event) => toggleSection('countries', event.currentTarget.checked)}
                        />
                        <Checkbox
                            label="Clubs"
                            checked={sections.clubs}
                            onChange={(event) => toggleSection('clubs', event.currentTarget.checked)}
                        />
                        <Checkbox
                            label="Totals"
                            checked={sections.totals}
                            onChange={(event) => toggleSection('totals', event.currentTarget.checked)}
                        />
                        <Checkbox
                            label="Games played"
                            checked={sections.outcomes}
                            onChange={(event) => toggleSection('outcomes', event.currentTarget.checked)}
                        />
                    </Group>

                    <CodeHighlight
                        // withExpandButton
                        // defaultExpanded={false}
                        code={json}
                        language="json"
                    />
                </Stack>
            </Paper>
        </Stack>
    );
};

export default DownloadMyData;
