@RestController
@RequestMapping("/api/code")
public class CodeController {
    @Autowired
    private CodeExecutionService codeExecutionService;

    @PostMapping("/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(
            @Valid @RequestBody CodeExecutionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Updated to handle test cases
        return ResponseEntity.ok(
                codeExecutionService.executeCode(
                        request.getCode(),
                        request.getLanguage(),
                        request.getTestCases()
                )
        );
    }

    @PostMapping("/submit/{exerciseId}")
    public ResponseEntity<CodeExecutionResponse> submitSolution(
            @PathVariable String exerciseId,
            @Valid @RequestBody CodeSubmissionRequest submission,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                codeExecutionService.submitSolution(
                        exerciseId,
                        submission.getCode(),
                        userDetails.getUsername()
                )
        );
    }

    @GetMapping("/statistics/{exerciseId}")
    public ResponseEntity<Map<String, Object>> getExerciseStatistics(
            @PathVariable String exerciseId) {
        Map<String, Object> statistics = new HashMap<>();
        List<CodeSubmission> submissions = codeExecutionService.getExerciseSubmissions(exerciseId);
        
        long totalSubmissions = submissions.size();
        long successfulSubmissions = submissions.stream()
                .filter(CodeSubmission::isSuccessful)
                .count();
        
        statistics.put("totalSubmissions", totalSubmissions);
        statistics.put("successRate", totalSubmissions > 0 ? 
                (double) successfulSubmissions / totalSubmissions * 100 : 0);
        statistics.put("submissions", submissions);
        
        return ResponseEntity.ok(statistics);
    }
}
