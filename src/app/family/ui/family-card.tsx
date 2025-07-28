import React from 'react'
import { Family } from '@/lib/definitions/family'

interface FamilyCardProps {
  family: Family
  isSelected: boolean
  onSelect: (family: Family) => void
}

export const FamilyCard = React.memo(function FamilyCard({
  family,
  isSelected,
  onSelect,
}: FamilyCardProps) {
  const handleClick = () => {
    onSelect(family)
  }

  return (
    <button
      onClick={handleClick}
      className={`p-4 rounded-lg border text-left transition-colors ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <h4 className="font-medium text-gray-900 dark:text-gray-100">
        {family.name}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {family.memberIds.length} members
      </p>
      {family.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {family.description}
        </p>
      )}
    </button>
  )
})