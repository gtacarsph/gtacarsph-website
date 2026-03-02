/**
 * GTACarsPH Cars Management System
 * CRUD operations for car inventory
 */

const CARS_KEY = 'gtacarsph_cars';

// Initialize with sample data if empty
function initCars() {
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    if (cars.length === 0) {
        // Sample cars for demo
        const sampleCars = [
            {
                id: '1',
                brand: 'Toyota',
                model: 'Vios',
                year: 2020,
                price: 580000,
                description: 'Well-maintained, automatic, low mileage',
                category: 'sedan',
                status: 'available',
                images: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                brand: 'Honda',
                model: 'City',
                year: 2019,
                price: 620000,
                description: 'Fuel efficient, manual transmission',
                category: 'sedan',
                status: 'available',
                images: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                brand: 'Ford',
                model: 'Ranger',
                year: 2021,
                price: 980000,
                description: '4x4, diesel, well-maintained',
                category: 'pickup',
                status: 'available',
                images: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(CARS_KEY, JSON.stringify(sampleCars));
    }
}

// Get all cars
function getAllCars() {
    return JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
}

// Get available cars only
function getAvailableCars() {
    return getAllCars().filter(car => car.status === 'available');
}

// Get car by ID
function getCarById(id) {
    return getAllCars().find(car => car.id === id);
}

// Add new car
function addCar(carData) {
    const cars = getAllCars();
    const newCar = {
        id: Date.now().toString(),
        ...carData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    cars.push(newCar);
    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    return newCar;
}

// Update car
function updateCar(id, updates) {
    const cars = getAllCars();
    const index = cars.findIndex(car => car.id === id);
    if (index !== -1) {
        cars[index] = { 
            ...cars[index], 
            ...updates, 
            updatedAt: new Date().toISOString() 
        };
        localStorage.setItem(CARS_KEY, JSON.stringify(cars));
        return cars[index];
    }
    return null;
}

// Delete car
function deleteCar(id) {
    const cars = getAllCars();
    const filtered = cars.filter(car => car.id !== id);
    localStorage.setItem(CARS_KEY, JSON.stringify(filtered));
    return filtered.length < cars.length;
}

// Search cars
function searchCars(query) {
    const cars = getAllCars();
    const lowerQuery = query.toLowerCase();
    return cars.filter(car => 
        car.brand.toLowerCase().includes(lowerQuery) ||
        car.model.toLowerCase().includes(lowerQuery) ||
        car.description.toLowerCase().includes(lowerQuery)
    );
}

// Filter by category
function filterByCategory(category) {
    if (category === 'all') return getAllCars();
    return getAllCars().filter(car => car.category === category);
}

// Export cars to JSON
function exportCarsToJSON() {
    const cars = getAllCars();
    const dataStr = JSON.stringify(cars, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gtacarsph-cars-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Get car categories
function getCategories() {
    return [
        { value: 'sedan', label: 'Sedan', icon: 'fa-car' },
        { value: 'suv', label: 'SUV', icon: 'fa-truck-monster' },
        { value: 'pickup', label: 'Pickup', icon: 'fa-truck-pickup' },
        { value: 'hatchback', label: 'Hatchback', icon: 'fa-car-side' },
        { value: 'van', label: 'Van', icon: 'fa-shuttle-van' },
        { value: 'sports', label: 'Sports Car', icon: 'fa-tachometer-alt' }
    ];
}

// Format price
function formatPrice(price) {
    return '₱' + price.toLocaleString('en-PH');
}

// Add image to car
function addCarImage(carId, base64Image) {
    const car = getCarById(carId);
    if (car) {
        if (!car.images) car.images = [];
        car.images.push({
            id: Date.now().toString(),
            data: base64Image,
            uploadedAt: new Date().toISOString()
        });
        updateCar(carId, { images: car.images });
        return true;
    }
    return false;
}

// Remove image from car
function removeCarImage(carId, imageId) {
    const car = getCarById(carId);
    if (car && car.images) {
        car.images = car.images.filter(img => img.id !== imageId);
        updateCar(carId, { images: car.images });
        return true;
    }
    return false;
}

// Get car thumbnail (first image or placeholder)
function getCarThumbnail(car) {
    if (car.images && car.images.length > 0) {
        return car.images[0].data;
    }
    return null;
}

// Initialize on load
initCars();