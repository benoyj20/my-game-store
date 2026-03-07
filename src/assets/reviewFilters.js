const reviewFilters = {
    reviewDate: [
        { name: 'Last 7 Days', abbr: '7_days' },
        { name: 'Last 30 Days', abbr: '30_days' },
        { name: 'Last 90 Days', abbr: '90_days' },
        { name: 'Last 6 Months', abbr: '6_months' },
        { name: 'Last Year', abbr: '1_year' },
    ],
    rating: [
        { name: '1-2 Star', abbr: '1-2' },
        { name: '3-4 Stars', abbr: '3-4' },
        { name: '5-6 Stars', abbr: '5-6' },
        { name: '7-8 Stars', abbr: '7-8' },
        { name: '9-10 Stars', abbr: '9-10' },
    ],
    publisher: [
        { name: 'Rockstar Games', abbr: 'Rockstar Games' },
        { name: 'Square Enix', abbr: 'Square Enix' },
        { name: 'Electronic Arts', abbr: 'Electronic Arts' },
        { name: 'Game Science', abbr: 'Game Science' },
        { name: 'CD Projekt', abbr: 'CD Projekt' },
        { name: 'Sony Interactive Entertainment', abbr: 'Sony Interactive Entertainment' },
        { name: 'Nintendo', abbr: 'Nintendo' },
        { name: 'Ubisoft', abbr: 'Ubisoft' },
        { name: 'Activision', abbr: 'Activision' },
        { name: 'Bethesda', abbr: 'Bethesda' },
    ],
};

export default reviewFilters;