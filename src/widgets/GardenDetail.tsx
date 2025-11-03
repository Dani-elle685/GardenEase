"use client";

import { mockGardens, mockBookings } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Calendar } from '../components/ui/calendar';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { MapPin, Users, Maximize2, Star, ArrowLeft, Check, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import garden1 from '../../public/assets/garden-1.jpg';
import garden2 from '../../public/assets/garden-2.jpg';
import garden3 from '../../public/assets/garden-3.jpg';
import garden4 from '../../public/assets/garden-4.jpg';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

const imageMap: Record<string, string> = {
  'garden-1': garden1.src,
  'garden-2': garden2.src,
  'garden-3': garden3.src,
  'garden-4': garden4.src,
};

interface GardenDetailProps {
    id: string;
}

const GardenDetail: React.FC<GardenDetailProps> = ({ id }) => {
  const { user } = useAuth();
  const garden = mockGardens.find((g) => g.id === id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [guests, setGuests] = useState('10');
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get all images for the garden
  const gardenImages = garden?.images?.length 
    ? garden.images.map(img => imageMap[img]) 
    : [imageMap[garden?.image || '']];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  if (!garden) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Garden not found</h1>
          <Link href="/browse">
            <Button>Browse Gardens</Button>
          </Link>
        </div>
      </div>
    );
  }

  const calculateHours = () => {
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    return end > start ? end - start : 0;
  };

  const hours = calculateHours();
  const totalPrice = hours > 0 ? garden ? garden.price * hours : 0 : 0;

  const checkAvailability = () => {
    if (!selectedDate || !garden) return;

    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);

    // Check if there are any conflicting bookings
    const hasConflict = mockBookings.some(booking => {
      if (booking.gardenId !== garden.id) return false;
      if (booking.date !== selectedDateStr) return false;
      if (booking.status === 'cancelled') return false;

      const bookingStart = parseInt(booking.startTime.split(':')[0]);
      const bookingEnd = parseInt(booking.endTime.split(':')[0]);

      // Check for time overlap
      return (startHour < bookingEnd && endHour > bookingStart);
    });

    setIsAvailable(!hasConflict);
  };

  useEffect(() => {
    checkAvailability();
  }, [selectedDate, startTime, endTime, garden?.id]);

  const handleBooking = () => {
    if (!user) {
      toast.error('Please sign in to book', {
        description: 'You need to be logged in to make a booking.'
      });
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (hours <= 0) {
      toast.error('Please select valid time range');
      return;
    }

    if (!isAvailable) {
      toast.error('Time slot not available', {
        description: 'This time slot is already booked. Please select a different time.'
      });
      return;
    }

    toast.success('Booking request sent!', {
      description: `${hours} hours booked for ${selectedDate.toLocaleDateString()}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/browse" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <img
                  src={gardenImages[selectedImageIndex]}
                  alt={`${garden.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-card/90 text-card-foreground backdrop-blur-sm text-lg px-4 py-2">
                    ${garden.price}/hour
                  </Badge>
                </div>
                {gardenImages.length > 1 && (
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                      {selectedImageIndex + 1} / {gardenImages.length}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {gardenImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gardenImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-24 rounded-lg overflow-hidden transition-all ${
                        selectedImageIndex === index 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${garden.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        fill
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Garden Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{garden.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{garden.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="font-medium text-foreground">{garden.rating}</span>
                      <span>({garden.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {garden.description}
              </p>
            </div>

            {/* Garden Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <Users className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="text-xl font-semibold">{garden.capacity} guests</p>
              </Card>
              <Card className="p-4">
                <Maximize2 className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="text-xl font-semibold">{garden.size} sqft</p>
              </Card>
              <Card className="p-4">
                <Star className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-xl font-semibold">{garden.rating}/5.0</p>
              </Card>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {garden.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Hosted by</h2>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {garden.ownerAvatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{garden.ownerName}</p>
                  <p className="text-sm text-muted-foreground">Garden Owner</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Book This Garden</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="mb-2">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger id="start-time">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger id="end-time">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max={garden.capacity}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Max capacity: {garden.capacity} guests
                    </p>
                  </div>
                </div>

                {/* Availability Status */}
                {selectedDate && hours > 0 && (
                  <Alert className={isAvailable ? 'border-green-500/50 bg-green-500/10' : 'border-destructive/50 bg-destructive/10'}>
                    {isAvailable ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    <AlertDescription>
                      {isAvailable ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ✓ Available for selected time
                        </span>
                      ) : (
                        <span className="text-destructive font-medium">
                          ✗ Already booked - please choose different time
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per hour</span>
                    <span className="font-medium">${garden.price}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {hours} {hours === 1 ? 'hour' : 'hours'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span className="font-medium">${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${(totalPrice * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleBooking}
                  disabled={!isAvailable || hours <= 0}
                >
                  {isAvailable ? 'Request Booking' : 'Time Slot Unavailable'}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  You won't be charged yet
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenDetail;
