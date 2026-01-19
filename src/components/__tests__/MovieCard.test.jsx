import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '../MovieCard';

// Mock CSS modules
vi.mock('../MovieCard.module.css', () => ({
  default: {
    card: 'card',
    poster: 'poster',
    noPoster: 'noPoster',
    content: 'content',
    title: 'title',
    year: 'year',
    overview: 'overview',
    actions: 'actions',
    button: 'button',
    noButton: 'noButton',
    yesButton: 'yesButton',
  },
}));

describe('MovieCard', () => {
  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test-poster.jpg',
    release_date: '2023-01-15',
    overview: 'This is a test movie overview.',
  };

  const mockOnVote = vi.fn();

  it('should render movie title', () => {
    render(<MovieCard movie={mockMovie} onVote={mockOnVote} />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('should render movie poster when poster_path exists', () => {
    render(<MovieCard movie={mockMovie} onVote={mockOnVote} />);

    const poster = screen.getByAltText('Test Movie');
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/test-poster.jpg'
    );
  });

  it('should render "No Image" when poster_path is missing', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };

    render(<MovieCard movie={movieWithoutPoster} onVote={mockOnVote} />);

    expect(screen.getByText('No Image')).toBeInTheDocument();
    expect(screen.queryByAltText('Test Movie')).not.toBeInTheDocument();
  });

  it('should render release year', () => {
    render(<MovieCard movie={mockMovie} onVote={mockOnVote} />);

    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('should not render year when release_date is missing', () => {
    const movieWithoutDate = { ...mockMovie, release_date: null };

    render(<MovieCard movie={movieWithoutDate} onVote={mockOnVote} />);

    expect(screen.queryByText('2023')).not.toBeInTheDocument();
  });

  it('should render movie overview', () => {
    render(<MovieCard movie={mockMovie} onVote={mockOnVote} />);

    expect(screen.getByText('This is a test movie overview.')).toBeInTheDocument();
  });

  it('should render fallback text when overview is missing', () => {
    const movieWithoutOverview = { ...mockMovie, overview: null };

    render(<MovieCard movie={movieWithoutOverview} onVote={mockOnVote} />);

    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });

  it('should render fallback text when overview is empty string', () => {
    const movieWithEmptyOverview = { ...mockMovie, overview: '' };

    render(<MovieCard movie={movieWithEmptyOverview} onVote={mockOnVote} />);

    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });

  it('should render Yes and No buttons', () => {
    render(<MovieCard movie={mockMovie} onVote={mockOnVote} />);

    expect(screen.getByText(/Yes/)).toBeInTheDocument();
    expect(screen.getByText(/No/)).toBeInTheDocument();
  });

  it('should call onVote with "yes" when Yes button is clicked', () => {
    render(<MovieCard movie={mockMovie} onVote={mockOnVote} />);

    const yesButton = screen.getByText(/Yes/);
    fireEvent.click(yesButton);

    expect(mockOnVote).toHaveBeenCalledWith('yes');
    expect(mockOnVote).toHaveBeenCalledTimes(1);
  });

  it('should call onVote with "no" when No button is clicked', () => {
    const mockFn = vi.fn();
    render(<MovieCard movie={mockMovie} onVote={mockFn} />);

    const noButton = screen.getByRole('button', { name: /No/ });
    fireEvent.click(noButton);

    expect(mockFn).toHaveBeenCalledWith('no');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple votes', () => {
    const mockFn = vi.fn();
    render(<MovieCard movie={mockMovie} onVote={mockFn} />);

    const yesButton = screen.getByRole('button', { name: /Yes/ });
    const noButton = screen.getByRole('button', { name: /No/ });

    fireEvent.click(yesButton);
    fireEvent.click(noButton);
    fireEvent.click(yesButton);

    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(mockFn).toHaveBeenNthCalledWith(1, 'yes');
    expect(mockFn).toHaveBeenNthCalledWith(2, 'no');
    expect(mockFn).toHaveBeenNthCalledWith(3, 'yes');
  });

  it('should render with minimal movie data', () => {
    const minimalMovie = {
      id: 2,
      title: 'Minimal Movie',
    };

    render(<MovieCard movie={minimalMovie} onVote={mockOnVote} />);

    expect(screen.getByText('Minimal Movie')).toBeInTheDocument();
    expect(screen.getByText('No Image')).toBeInTheDocument();
    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });

  it('should handle different release date formats', () => {
    const movieWithDate = { ...mockMovie, release_date: '2020-12-25' };

    render(<MovieCard movie={movieWithDate} onVote={mockOnVote} />);

    expect(screen.getByText('2020')).toBeInTheDocument();
  });

  it('should render poster with correct URL structure', () => {
    const movieWithPath = {
      ...mockMovie,
      poster_path: '/another-poster.jpg',
    };

    render(<MovieCard movie={movieWithPath} onVote={mockOnVote} />);

    const poster = screen.getByAltText('Test Movie');
    expect(poster).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/another-poster.jpg'
    );
  });
});
