import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Headphones, FileText } from 'lucide-react';

const getResourceType = (id: string) => {
  if (id.includes('video')) return { icon: PlayCircle, label: 'Video' };
  if (id.includes('audio')) return { icon: Headphones, label: 'Audio' };
  return { icon: FileText, label: 'Guide' };
};

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Resource Hub
        </h1>
        <p className="text-muted-foreground mt-2">
          A curated library of resources to support your mental well-being.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PlaceHolderImages.map(resource => {
          const type = getResourceType(resource.id);
          return (
            <Card
              key={resource.id}
              className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={resource.imageUrl}
                    alt={resource.description}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={resource.imageHint}
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-3 right-3"
                  >
                    <type.icon className="mr-1.5 h-3 w-3" />
                    {type.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <CardTitle className="mb-2 text-lg">{resource.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full">
                  {type.label === 'Video' && 'Watch Now'}
                  {type.label === 'Audio' && 'Listen Now'}
                  {type.label === 'Guide' && 'Read Now'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
