import React from 'react';
import useStore from '../store/useStore';
import { groupCarsByClass } from '../utils/helpers';

interface CarBadgesProps {
  cars: string;
}

export default function CarBadges({ cars }: CarBadgesProps) {
  const clearCarFilter = useStore(s => s.clearCarFilter);
  const addCarFilter = useStore(s => s.addCarFilter);
  const setActiveTab = useStore(s => s.setActiveTab);

  const groups = groupCarsByClass(cars);

  function handleCarClick(e: React.MouseEvent, car: string) {
    e.stopPropagation();
    clearCarFilter();
    addCarFilter(car);
    setActiveTab('all');
  }

  function handleGroupClick(e: React.MouseEvent, carList: string[]) {
    e.stopPropagation();
    clearCarFilter();
    carList.forEach(car => addCarFilter(car));
    setActiveTab('all');
  }

  // ≤4 cars: individual badges
  if (!groups) {
    const carList = cars.split(',').map(c => c.trim()).filter(Boolean);
    return (
      <>
        {carList.map((car, i) => (
          <span key={i} className="tw-card-cars-badge tw-card-cars-clickable" onClick={e => handleCarClick(e, car)}>
            {car}
          </span>
        ))}
      </>
    );
  }

  // >4 cars: one badge per class group
  return (
    <>
      {groups.map((group, i) => (
        <span key={i} className="cars-group-wrapper">
          <span
            className="tw-card-cars-badge tw-card-cars-group"
            onClick={e => handleGroupClick(e, group.cars)}
            title="Filter by this class"
          >
            {group.label}
          </span>
          <span className="cars-tooltip">
            {group.cars.map((car, j) => <span key={j}>{car}</span>)}
          </span>
        </span>
      ))}
    </>
  );
}
