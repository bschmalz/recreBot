import { IconButton } from '@chakra-ui/react';
import { Box, Heading, Link, Text } from '@chakra-ui/layout';
import React from 'react';
import { StyledContainer } from './StyledContainer';
import { MdAddCircle, MdArrowBack } from 'react-icons/md';
import { useTripType } from '../contexts/TripTypeContext';
import { useSearchLocations } from '../contexts/SearchLocationsContext';
import { useSelectedPlaces } from '../contexts/SelectedPlacesContext';
import { useMap } from '../contexts/MapContext';
import { useMain } from '../contexts/MainContext';

export const SelectedCard = () => {
  const { campgrounds, trailheads } = useSearchLocations();
  const { addSelectedPlace, selectCard, selectedCard } = useSelectedPlaces();
  const { removeMarker, updateMapMarkers, zoomOnSelectedCard } = useMap();
  const { sideBarRef, scrollRef } = useMain();
  const { tripType } = useTripType();

  const {
    id,
    latitude,
    legacy_id,
    longitude,
    name,
    parent_name,
    type,
    sub_type,
    district,
    description,
    subparent_id,
  } = selectedCard;

  const createMarkup = () => {
    return { __html: description };
  };

  const addSelectedCard = (selectedCard) => {
    addSelectedPlace(selectedCard);
    removeMarker(selectedCard.id);
    const markers =
      tripType === 'Camp'
        ? campgrounds.filter((cg) => cg.id !== selectedCard.id)
        : trailheads.filter((th) => th.id !== selectedCard.id);
    requestAnimationFrame(() => {
      updateMapMarkers(markers);
      sideBarRef.current.scrollTop = scrollRef.current;
    });
  };

  const handleCardClick = (id) => {
    if (!id) {
      selectCard(null);
      requestAnimationFrame(() => {
        sideBarRef.current.scrollTop = scrollRef.current;
        const markers = tripType === 'Camp' ? campgrounds : trailheads;
        updateMapMarkers(markers);
      });
      return;
    }
    let item, type;
    if (tripType === 'Camp') {
      item = campgrounds.find((cg) => cg.id === id);
      type = 'campground';
    } else {
      item = trailheads.find((th) => th.id === id);
      type = 'trailhead';
    }
    scrollRef.current = sideBarRef.current.scrollTop;
    sideBarRef.current.scrollTop = 170;
    selectCard({ ...item, type });
    zoomOnSelectedCard(item);
  };

  const renderLinkHref = () => {
    if (type === 'trailhead') {
      return renderRGTrailhead();
    } else {
      if (sub_type === 'res_ca') return renderCACamp();
      else return renderRGCamp();
    }
  };

  const renderCACamp = () => {
    return `https://www.reservecalifornia.com/Web/#!park/${legacy_id}`;
  };

  const renderRGCamp = () => {
    return `https://www.recreation.gov/camping/campgrounds/${legacy_id}`;
  };

  const renderRGTrailhead = () => {
    return `https://www.recreation.gov/permits/${subparent_id}`;
  };

  return (
    <StyledContainer
      padding={6}
      paddingTop={8}
      bg='white'
      borderRadius={6}
      position='relative'
    >
      <IconButton
        aria-label='Back To Search Results'
        icon={<MdArrowBack size={24} />}
        isRound
        position='absolute'
        onClick={() => handleCardClick(null)}
        minWidth='35px'
        maxHeight='35px'
        top={0}
        left={0}
        variant='ghost'
      />
      <IconButton
        color='green.500'
        colorScheme='green'
        onClick={() => addSelectedCard(selectedCard)}
        position='absolute'
        minWidth='35px'
        maxHeight='35px'
        top={0}
        right={0}
        aria-label={tripType === 'Camp' ? 'Add Camground' : 'Add Trailhead'}
        icon={<MdAddCircle size={24} />}
        isRound={true}
        variant='ghost'
      />
      <img src={`/${type}/${id}.png`} alt={`Picture of ${name}`} />
      <Box marginTop={3} textAlign='left'>
        <Heading as='h1' size='md'>
          {name}
        </Heading>
        {parent_name ? (
          <Text fontSize='sm'>
            {parent_name}
            {district ? `, ${district}` : ''}
          </Text>
        ) : null}
        <Text fontSize='sm'>
          <Link href={renderLinkHref()} target='_blank'>
            Reservation Page
          </Link>
        </Text>

        {description ? (
          <Box
            className='recrebot-innerhtml'
            dangerouslySetInnerHTML={createMarkup()}
            marginTop={2}
          />
        ) : null}
      </Box>
    </StyledContainer>
  );
};
