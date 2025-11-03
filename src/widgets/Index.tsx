"use client";
import { Button } from '../components/ui/button';
import { GardenCard } from '../components/GardenCard';
import { mockGardens } from '../data/mockData';
import { Search, Calendar, Shield, Sparkles } from 'lucide-react';
import heroImage from '../../public/assets/hero-garden.jpg';
import Link from 'next/link';

const Index = () => {
  const featuredGardens = mockGardens.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage.src}
            alt="Beautiful garden"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Discover Your Perfect
            <br />
            Garden Space
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Book beautiful gardens for events, photoshoots, or peaceful retreats
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button variant="hero" size="lg" className="bg-card text-foreground hover:bg-card/90">
                <Search className="mr-2 h-5 w-5" />
                Browse Gardens
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="hero" size="lg" className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                List Your Garden
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
              <p className="text-muted-foreground">
                Browse hundreds of unique gardens with detailed photos and amenities
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
              <p className="text-muted-foreground">
                Check real-time availability and book your perfect garden in minutes
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Gardens</h3>
              <p className="text-muted-foreground">
                All listings verified by our team to ensure quality and safety
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gardens */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Gardens</h2>
              <p className="text-muted-foreground">
                Discover our hand-picked selection of beautiful spaces
              </p>
            </div>
            <Link href="/browse">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGardens.map((garden) => (
              <GardenCard key={garden.id} garden={garden} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Have a Beautiful Garden?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Share your space with others and earn income while making memories possible
          </p>
          <Link href="/dashboard">
            <Button variant="hero" size="lg" className="bg-card text-foreground hover:bg-card/90">
              Become a Host
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 GardenBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
