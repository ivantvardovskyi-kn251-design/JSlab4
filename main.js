class Car {
  constructor(id, plate, brand, capacity, fuelPer100) {
    this.id = id;
    this.plate = plate;
    this.brand = brand;
    this.capacity = capacity;
    this.fuelPer100 = fuelPer100;
  }
}

class Driver {
  constructor(id, fullName, personnelNumber, category) {
    this.id = id;
    this.fullName = fullName;
    this.personnelNumber = personnelNumber;
    this.category = category;
  }
}

class Trip {
  constructor(id, carId, driverId, departureDate, returnDate, distance,
              origin, destination, cargo, status) {
    this.id = id;
    this.carId = carId;
    this.driverId = driverId;
    this.departureDate = departureDate;
    this.returnDate = returnDate;
    this.distance = distance;
    this.origin = origin;
    this.destination = destination;
    this.cargo = cargo;
    this.status = status;
  }
}

class Repository {
  #items = [];

  constructor(initialItems = []) {
    this.#items = [...initialItems];
  }

  create(item) {
    this.#items.push(item);
    return item;
  }

  readById(id) {
    return this.#items.find(item => item.id === id);
  }

  readAll() {
    return [...this.#items];
  }

  update(id, changes) {
    const item = this.readById(id);
    if (item) Object.assign(item, changes);
    return item;
  }

  delete(id) {
    const before = this.#items.length;
    this.#items = this.#items.filter(item => item.id !== id);
    return this.#items.length < before;
  }
}

const cars = new Repository([
  new Car("A-001", "AT 1234 BK", "MAN TGS", 18, 32.5),
  new Car("A-002", "AT 5678 CM", "Volvo FH16", 25, 35.0),
  new Car("A-003", "AT 9012 HP", "Mercedes Atego", 8, 21.4),
]);

const drivers = new Repository([
  new Driver("D-001", "Твардовський І.", "TN-1015", "C, CE"),
  new Driver("D-002", "Ковальчук І.", "TN-1022", "C"),
  new Driver("D-003", "Бойко Олег Васильович", "TN-1037", "B, C, CE"),
]);

const trips = new Repository([
  new Trip("T-001", "A-001", "D-001", "2026-03-02", "2026-03-04", 610,
           "Івано-Франківськ", "Київ", "Будматеріали", "завершено"),
  new Trip("T-002", "A-002", "D-001", "2026-03-10", "2026-03-12", 780,
           "Івано-Франківськ", "Одеса", "Продукти харчування", "завершено"),
  new Trip("T-003", "A-001", "D-002", "2026-03-15", "2026-03-16", 140,
           "Івано-Франківськ", "Львів", "Меблі", "в дорозі"),
  new Trip("T-004", "A-003", "D-003", "2026-03-18", "2026-03-18", 95,
           "Івано-Франківськ", "Тернопіль", "Побутова техніка", "заплановано"),
]);

function printTrips(list) {
  for (const t of list) {
    console.log(
      `[${t.id}] ${t.origin} → ${t.destination}, ${t.distance} км, ` +
      `${t.departureDate}…${t.returnDate}, вантаж: ${t.cargo}, ` +
      `авто: ${t.carId}, водій: ${t.driverId}, статус: ${t.status}`
    );
  }
}

console.log("Завдання 3. Початкові дані");
console.log("Автомобілі:");
cars.readAll().forEach(c => console.log(`  [${c.id}] ${c.brand}, ${c.plate}, ${c.capacity} т`));
console.log("Водії:");
drivers.readAll().forEach(d => console.log(`  [${d.id}] ${d.fullName}, ${d.personnelNumber}, кат. ${d.category}`));
console.log("Рейси:");
printTrips(trips.readAll());

console.log("\nЗавдання 4. Зв'язок «багато до багатьох»");

console.log("Усі рейси водія D-001 (один водій — різні автомобілі):");
for (const trip of trips.readAll()) {
  if (trip.driverId === "D-001") {
    const car = cars.readById(trip.carId);
    console.log(`- ${trip.id}: ${car.brand} (${car.plate}), ${trip.origin} → ${trip.destination}`);
  }
}

console.log("Усі рейси автомобіля A-001 (один автомобіль — різні водії):");
for (const trip of trips.readAll()) {
  if (trip.carId === "A-001") {
    const driver = drivers.readById(trip.driverId);
    console.log(`- ${trip.id}: ${driver.fullName}, статус: ${trip.status}`);
  }
}

console.log("\nЗавдання 5. CRUD над рейсами");

trips.create(new Trip("T-005", "A-002", "D-003", "2026-03-20", "2026-03-22", 540,
                      "Івано-Франківськ", "Харків", "Добрива", "заплановано"));
console.log("Після Create (додано T-005):");
printTrips(trips.readAll());

console.log("\nRead за id T-003:", trips.readById("T-003"));

trips.update("T-003", { status: "завершено", returnDate: "2026-03-17" });
console.log("\nПісля Update (T-003 — статус «завершено»):");
printTrips(trips.readAll());

trips.delete("T-004");
console.log("\nПісля Delete (видалено T-004):");
printTrips(trips.readAll());

console.log("\nКількість рейсів:", trips.readAll().length);
