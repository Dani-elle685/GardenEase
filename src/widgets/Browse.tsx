"use client";

import { useState } from 'react';
import { GardenCard } from '../components/GardenCard';
import { mockGardens } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const allAmenities = Array.from(
    new Set(mockGardens.flatMap((garden) => garden.amenities))
  );

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filteredGardens = mockGardens.filter((garden) => {
    const matchesSearch =
      garden.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garden.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garden.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => garden.amenities.includes(amenity));

    return matchesSearch && matchesAmenities;
  });

  const sortedGardens = [...filteredGardens].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'capacity':
        return b.capacity - a.capacity;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
  
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Gardens</h1>
          <p className="text-muted-foreground">
            Find the perfect outdoor space for your next event
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="capacity">Largest Capacity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amenity Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by amenities:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={selectedAmenities.includes(amenity) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
              {selectedAmenities.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAmenities([])}
                  className="h-6 px-2"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {sortedGardens.length} of {mockGardens.length} gardens
          </p>
        </div>

        {/* Garden Grid */}
        {sortedGardens.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGardens.map((garden) => (
              <GardenCard key={garden.id} garden={garden} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">
              No gardens match your search criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedAmenities([]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
