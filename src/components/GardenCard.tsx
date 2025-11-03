import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Users, Star, Maximize2 } from 'lucide-react';
import garden1 from '../../public/assets/garden-1.jpg';
import garden2 from '../../public/assets/garden-2.jpg';
import garden3 from '../../public/assets/garden-3.jpg';
import garden4 from '../../public/assets/garden-4.jpg';
import { Garden } from '../types/garden';
import Link from 'next/link';

const imageMap: Record<string, string> = {
  'garden-1': garden1.src,
  'garden-2': garden2.src,
  'garden-3': garden3.src,
  'garden-4': garden4.src,
};

interface GardenCardProps {
  garden: Garden;
}

export const GardenCard = ({ garden }: GardenCardProps) => {
  // Use first image from images array if available, otherwise fallback to image property
  const displayImage = garden.images && garden.images.length > 0 
    ? imageMap[garden.images[0]] 
    : imageMap[garden.image];

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={displayImage}
          alt={garden.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-card/90 text-card-foreground backdrop-blur-sm">
            ${garden.price}/hour
          </Badge>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          <span className="text-xs font-medium">{garden.rating}</span>
          <span className="text-xs text-muted-foreground">({garden.reviews})</span>
        </div>
        {garden.images && garden.images.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs">
              +{garden.images.length - 1} photos
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{garden.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{garden.location}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {garden.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{garden.capacity} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="h-3 w-3" />
            <span>{garden.size} sqft</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {garden.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {garden.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{garden.amenities.length - 3} more
            </Badge>
          )}
        </div>
        
        <Link href={`/garden/${garden.id}`} className="block">
          <Button className="w-full">View Details</Button>
        </Link>
      </div>
    </Card>
  );
};
