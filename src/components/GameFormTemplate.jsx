import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MultipleSelectChip from './MultipleSelectChip';
import gameFilters from '../assets/gameFilters';
import dayjs from 'dayjs';

const GameFormTemplate = ({
    formData,
    errors,
    handleChange,
    handleDateChange,
    isUpdate = false,
    games = [],
    publishers,
    genres,
    selectedGenres,
    setSelectedGenres,
    isOverWordLimit,
    wordCount,
    notificationComponent
}) => {

    const safeValue = (value) => value === null ? '' : value;

    return (
        <Box display="flex" flexDirection="column" gap={2}>

            {isUpdate && (
                <>
                    <InputLabel htmlFor="game-select">Game Title To Update</InputLabel>
                    <FormControl fullWidth variant="outlined" error={!!errors.game}>
                        <InputLabel id="game-select-label">Game</InputLabel>
                        <Select
                            labelId="game-select-label"
                            id="game-select"
                            name="game"
                            value={safeValue(formData.game)}
                            label="Game"
                            onChange={handleChange}
                        >
                            {games.map((game) => (
                                <MenuItem key={game.title} value={game.title}>
                                    {game.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {errors.game && <FormHelperText error>{errors.game}</FormHelperText>}
                </>
            )}

            {!isUpdate && (
                <>
                    <TextField
                        id="game"
                        name="game"
                        value={formData.game}
                        label="Game"
                        variant="outlined"
                        onChange={handleChange}
                        error={!!errors.game}
                        helperText={errors.game || undefined}
                    />
                </>
            )}

            <TextField
                id="developer"
                name="developer"
                value={formData.developer}
                label="Developer"
                variant="outlined"
                onChange={handleChange}
                error={!!errors.developer}
                helperText={errors.developer || undefined}
            />

            <FormControl fullWidth variant="outlined" error={!!errors.publisher}>
                <InputLabel id="publisher-select-label">Publisher</InputLabel>
                <Select
                    labelId="publisher-select-label"
                    id="publisher-select"
                    name="publisher"
                    value={safeValue(formData.publisher)}
                    label="Publisher"
                    onChange={handleChange}
                >
                    {publishers.map((publisher) => (
                        <MenuItem key={publisher} value={publisher}>
                            {publisher}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {errors.publisher && <FormHelperText error>{errors.publisher}</FormHelperText>}

            <MultipleSelectChip
                key="genre"
                name="genre"
                label="Genre"
                valueList={genres.map(genre => genre)}
                valueName={selectedGenres}
                setValueName={setSelectedGenres}
                gap={0}
            />
            {errors.genre && <FormHelperText error>{errors.genre}</FormHelperText>}

            <FormControl fullWidth variant="outlined" error={!!errors.rating}>
                <InputLabel id="rating-select-label">Rating</InputLabel>
                <Select
                    labelId="rating-select-label"
                    id="rating-select"
                    name="rating"
                    value={safeValue(formData.rating)}
                    label="Rating"
                    onChange={handleChange}
                >
                    {gameFilters.rating.map((rating) => (
                        <MenuItem key={rating.abbr} value={rating.abbr}>
                            {rating.abbr}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {errors.rating && <FormHelperText error>{errors.rating}</FormHelperText>}

            <InputLabel htmlFor="date-picker-release">Release Date</InputLabel>
            <DatePicker
                defaultValue={dayjs('2025-01-01')}
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleDateChange}
                slotProps={{
                    textField: {
                        error: !!errors.releaseDate,
                        helperText: errors.releaseDate || undefined,
                        id: 'date-picker-release'
                    }
                }}
            />

            <TextField
                id="description-input"
                name="description"
                label="Description"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={formData.description}
                onChange={handleChange}
                error={isOverWordLimit || !!errors.description}
                helperText={errors.description ? errors.description : `${wordCount}/100 words`}
            />

            <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
            <Input
                id="standard-adornment-amount"
                name="amount"
                value={formData.amount}
                type="number"
                onChange={handleChange}
                error={!!errors.amount}
                startAdornment={
                    <InputAdornment position="start">
                        $
                    </InputAdornment>}
            />
            {errors.amount && <FormHelperText error>{errors.amount}</FormHelperText>}

            <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
            >
                Submit
            </Button>

            {notificationComponent}

        </Box>
    );
};

export default GameFormTemplate;