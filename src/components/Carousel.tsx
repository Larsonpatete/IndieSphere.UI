import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@heroui/react';

interface CarouselProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    itemsToShow?: number;
}

export const Carousel = <T,>({ items, renderItem, itemsToShow = 4 }: CarouselProps<T>) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < items.length - itemsToShow ? prevIndex + 1 : prevIndex));
    };

    useEffect(() => {
        if (containerRef.current) {
            const itemWidth = containerRef.current.scrollWidth / items.length;
            containerRef.current.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
    }, [currentIndex, items.length]);

    return (
        <div className="relative w-full flex items-center">
            <Button onClick={goToPrevious} disabled={currentIndex === 0} className="z-10">
                &lt;
            </Button>
            <div className="overflow-hidden flex-1">
                <div
                    ref={containerRef}
                    className="flex transition-transform duration-500 ease-in-out"
                >
                    {items.map((item, index) => (
                        <div key={index} className="flex-shrink-0" style={{ width: `${100 / itemsToShow}%` }}>
                            <div className="p-2">
                                {renderItem(item)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Button onClick={goToNext} disabled={currentIndex >= items.length - itemsToShow} className="z-10">
                &gt;
            </Button>
        </div>
    );
};
