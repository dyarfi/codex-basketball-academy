import { RadarChart } from '@mantine/charts'
import { Box, Title } from '@mantine/core'
import '@mantine/charts/styles.css'

interface GraphProps {
  title?: string
  graphData?: Array<{ skill: string; value: string }> // If present, it's an edit
  isLoading?: boolean
}

const GraphSkills: React.FC<GraphProps> = ({
  title = 'Radar Chart',
  graphData,
}) => {
  return (
    <Box pos="relative">
      <Title c="blue" size={'h5'} fw={'600'}>
        {title}
      </Title>
      <RadarChart
        h={400}
        w={470}
        closeDelay={500}
        data={graphData}
        dataKey="skill"
        series={[{ name: 'value', color: 'lime', strokeColor: 'gray' }]}
        withPolarGrid
        withPolarAngleAxis
        withPolarRadiusAxis
        withTooltip
        withDots
      />
    </Box>
  )
}

export default GraphSkills
