import MultipleSelectChip from '../components/MultipleSelectChip';

function Filters({ selectedFilters, setSelectedFilters, setSelectedFiltersSQL, filters }) {
    const getLabel = (key) => key.charAt(0).toUpperCase() + key.slice(1);
    return (
        <div sx={{ width: '100%' }}>
            {Object.keys(filters).map((filterKey) => (
                            <MultipleSelectChip 
                                key={filterKey}
                                label={getLabel(filterKey)} 
                                valueList={filters[filterKey].map(item => item.name)}    
                                valueName={selectedFilters[filterKey]}
                                setValueName={(newDisplayNames) => {
                                setSelectedFilters(prev => ({
                                        ...prev,
                                        [filterKey]: newDisplayNames
                                    }));
                                    

                                    const filterOptions = filters[filterKey];
                                    const newAbbrValues = newDisplayNames.map(displayName => {
                                        const found = filterOptions.find(opt => opt.name === displayName);
                                        return found ? found.abbr : null;
                                    }).filter(Boolean);

                                    setSelectedFiltersSQL(prev => ({
                                        ...prev,
                                        [filterKey]: newAbbrValues
                                    }));
                                }}
                                gap={1.5}
                            />
                        ))}
        </div>
    );
}

export default Filters;